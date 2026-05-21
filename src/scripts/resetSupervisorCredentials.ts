import 'dotenv/config';
import { Employee, Supervisor } from '../lib/db';
import { sendCredentialInvite } from '../lib/email';
import {
  createCreateCredentialsInviteInDB,
  getCreateCredentialsInviteFromDB,
  updateCreateCredentialsInviteInDB
} from '../lib/db/controller';
import {
  deleteLoginCredentialFromDB,
  getLoginCredentialFromDB
} from '../lib/db/controller/LoginCredential';

if (require.main === module) {
  const defaultSupervisorName = process.env.SEND_INVITE_DEFAULT_SUPERVISOR_NAME;
  const [, , email, supervisorNameArg] = process.argv;
  const supervisorName = supervisorNameArg ?? defaultSupervisorName;

  if (!email) {
    console.error('❌ Missing required arguments: email');
    process.exit(1);
  }

  if (!supervisorName) {
    console.error(
      '❌ Missing required arguments: supervisorName (or set SEND_INVITE_DEFAULT_SUPERVISOR_NAME)'
    );
    process.exit(1);
  }

  try {
    (async () => {
      console.log('🔍 Searching for supervisor...');

      const employee = await Employee.findOne({ where: { name: supervisorName } });

      if (!employee) {
        throw new Error(`Supervisor employee record not found for "${supervisorName}"`);
      }

      const supervisor = await Supervisor.findOne({ where: { employee_id: employee.id } });

      if (!supervisor) {
        throw new Error(`Supervisor record not found for "${supervisorName}"`);
      }

      const existingCredentials = await getLoginCredentialFromDB.bySupervisorId(supervisor.id);

      if (existingCredentials) {
        console.log('🧹 Existing login credentials found. Deleting...');
        await deleteLoginCredentialFromDB(existingCredentials.id);
      }

      let credentialInvite = await getCreateCredentialsInviteFromDB({
        supervisor_id: supervisor.id
      });

      if (!credentialInvite) {
        const adminSupervisor = await Supervisor.findOne({ where: { is_admin: true } });

        if (!adminSupervisor) {
          throw new Error('Admin supervisor not found');
        }

        credentialInvite = await createCreateCredentialsInviteInDB({
          email,
          created_by: adminSupervisor.id,
          supervisor_id: supervisor.id
        });
      } else if (credentialInvite.email !== email) {
        credentialInvite = await updateCreateCredentialsInviteInDB({
          id: credentialInvite.id,
          updateData: { email }
        });
      }

      if (!credentialInvite) {
        throw new Error('Failed to create or retrieve credential invite');
      }

      const username = employee.name?.trim() || supervisorName;
      const inviteId = credentialInvite.id;
      const token = credentialInvite.invite_token;

      console.log('📧 Processing reset/update invite...');
      if (process.env.SEND_EMAILS === 'true') {
        await sendCredentialInvite(email, token, inviteId, username);
        console.log('✅ Credential reset/update invite sent successfully to:', email);
      } else {
        const url = `/sign-up/?invite-id=${inviteId}&token=${token}`;
        console.log('⚠️  Email sending is disabled. Set SEND_EMAILS=true to enable email sending.');
        console.log(`Create or update credentials using the following link: ${url}`);
      }
    })();
  } catch (error) {
    console.error('❌ Error resetting/updating credentials:', error);
    process.exit(1);
  }
}
