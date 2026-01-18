import 'dotenv/config';
import {Employee, Supervisor} from '../lib/db';
import {sendCredentialInvite} from '../lib/email';
import {getCreateCredentialsInviteFromDB} from '../lib/db/controller';

if (require.main === module) {
  const [, , email] = process.argv;

  if (!email) {
    console.error('❌ Missing required arguments: email');
    process.exit(1);
  }

  try {
    (async () => {
      console.log('🔍 Searching for Database Credentials...');
      const employee = await Employee.findOne({where: {name: 'Umer Shahid'}});
      const supervisor = await Supervisor.findOne({where: {employee_id: employee?.id}});
      const existingInvite = await getCreateCredentialsInviteFromDB({
        supervisor_id: supervisor?.id
      });

      const username = employee?.name ?? '';
      const inviteId = existingInvite?.id ?? '';
      const token = existingInvite?.invite_token ?? '';

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
