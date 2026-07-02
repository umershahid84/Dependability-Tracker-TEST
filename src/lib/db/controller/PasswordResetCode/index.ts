import PasswordResetCode from '../../models/PasswordResetCode';
import bcrypt from 'bcrypt';

export const createPasswordResetCodeInDB = async (props: {
  supervisor_id?: string | null;
  email: string;
  code: string;
  expires_at: Date;
}) => {
  try {
    const codeHash = await bcrypt.hash(codeToString(props.code), parseInt(process.env.SALT_ROUNDS ?? '11'));

    // invalidate previous codes for this email
    await PasswordResetCode.update({ used: true }, { where: { email: props.email, used: false } });

    const record = await PasswordResetCode.create({
      supervisor_id: props.supervisor_id ?? null,
      email: props.email,
      code_hash: codeHash,
      expires_at: props.expires_at,
      used: false
    });

    return record;
  } catch (error) {
    throw new Error(`❌ Error creating password reset code: ${String(error)}`);
  }
};

const codeToString = (code: string) => String(code);

export const getActivePasswordResetCodeByEmail = async (email: string) => {
  try {
    const now = new Date();
    const record = await PasswordResetCode.findOne({
      where: { email, used: false, expires_at: { ["$gt"]: now } },
      order: [['created_at', 'DESC']]
    });
    return record;
  } catch (error) {
    throw new Error(`❌ Error getting active password reset code: ${String(error)}`);
  }
};

export const markPasswordResetCodeUsed = async (id: string) => {
  try {
    await PasswordResetCode.update({ used: true }, { where: { id } });
    return true;
  } catch (error) {
    throw new Error(`❌ Error marking password reset code used: ${String(error)}`);
  }
};

export const invalidatePasswordResetCodesByEmail = async (email: string) => {
  try {
    await PasswordResetCode.update({ used: true }, { where: { email, used: false } });
    return true;
  } catch (error) {
    throw new Error(`❌ Error invalidating password reset codes: ${String(error)}`);
  }
};
