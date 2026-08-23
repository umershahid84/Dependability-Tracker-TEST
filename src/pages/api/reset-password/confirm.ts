import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { Op } from 'sequelize';
import PasswordResetCode from '../../../lib/db/models/PasswordResetCode';
import { getLoginCredentialFromDB } from '../../../lib/db/controller/LoginCredential';
import LoginCredential from '../../../lib/db/models/LoginCredential';
import { markPasswordResetCodeUsed } from '../../../lib/db/controller/PasswordResetCode';
import { logTemplate } from '../../../lib/utils/server';

export default async function handler(req: Request, res: Response) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { body } = req as { body: { email: string; code: string; password: string } };
    const email = body?.email?.trim().toLowerCase();
    const code = String(body?.code ?? '').trim();
    const newPassword = body?.password ?? '';

    if (!email || !code || !newPassword) {
      return res.status(400).json({ error: 'Email, code, and password are required' });
    }

    // find active code
    const now = new Date();
    const resetRecord: any = await PasswordResetCode.findOne({
      where: { email, used: false, expires_at: { [Op.gt]: now } },
      order: [['created_at', 'DESC']]
    });

    if (!resetRecord) {
      return res.status(401).json({ error: 'Invalid or expired code' });
    }

    const matches = await bcrypt.compare(code, resetRecord.code_hash);
    if (!matches) {
      return res.status(401).json({ error: 'Invalid code' });
    }

    // find existing login credential for this email
    const existing = await LoginCredential.findOne({ where: { email } });

    if (existing) {
      // update password (beforeUpdate hook will hash)
      await LoginCredential.update({ password: newPassword }, { where: { id: existing.id } });
    } else {
      // we need a supervisor_id to create a credential
      const supervisorId = resetRecord.supervisor_id;
      if (!supervisorId) {
        return res.status(400).json({ error: 'Cannot create credentials: no supervisor linked to reset code' });
      }
      await LoginCredential.create({ email, password: newPassword, supervisor_id: supervisorId });
    }

    // mark code used
    await markPasswordResetCodeUsed(resetRecord.id);

    return res.status(200).json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error(logTemplate('❌ Error in reset-password confirm: ' + String(error), 'error'));
    return res.status(500).json({ error: String(error) });
  }
}

export const config = { api: { externalResolver: true, bodyParser: true } };
