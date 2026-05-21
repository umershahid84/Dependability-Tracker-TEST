import 'dotenv/config';
import {Employee, Supervisor} from '../lib/db';
import {sendCredentialInvite} from '../lib/email';
import {
  createCreateCredentialsInviteInDB,
  getCreateCredentialsInviteFromDB
} from '../lib/db/controller';

if (require.main === module) {
  const [, , email, supervisorName = 'Umer Shahid'] = process.argv;

  if (!email) {
    console.error('❌ Missing required arguments: email');
    process.exit(1);
  }

  try {
    (async () => {
      console.log('🔍 Searching for Database Credentials...');
      const employee = await Employee.findOne({where: {name: supervisorName}});

      if (!employee) {
        throw new Error(`Supervisor employee record not found for "${supervisorName}"`);
      }

      const supervisor = await Supervisor.findOne({where: {employee_id: employee?.id}});

      if (!supervisor) {
        throw new Error(`Supervisor record not found for "${supervisorName}"`);
      }

      let credentialInvite = await getCreateCredentialsInviteFromDB({
        supervisor_id: supervisor.id
      });

      if (!credentialInvite) {
        const adminSupervisor = await Supervisor.findOne({where: {is_admin: true}});

        if (!adminSupervisor) {
          throw new Error('Admin supervisor not found');
        }

        credentialInvite = await createCreateCredentialsInviteInDB({
          email,
          created_by: adminSupervisor.id,
          supervisor_id: supervisor.id
        });
      }

      if (!credentialInvite) {
        throw new Error('Failed to create or retrieve credential invite');
      }

      const username = employee?.name ?? '';
      const inviteId = credentialInvite.id;
      const token = credentialInvite.invite_token;

      console.log('📧 Sending email...');
      if (process.env.SEND_EMAILS == 'true') {
        await sendCredentialInvite(email, token, inviteId, username);

        console.log('✅ Email sent successfully to:', email);
      } else {
        const URL = `/sign-up/?invite-id=${inviteId}&token=${token}`;
        console.log('⚠️  Email sending is disabled. Set SEND_EMAILS=true to enable email sending.');
        console.log(`Create your credentials using the following link: ${URL}`);
      }
    })();
  } catch (error) {
    console.error('❌ Error sending email:', error);
  }
}
