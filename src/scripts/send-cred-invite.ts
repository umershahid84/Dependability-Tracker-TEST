import 'dotenv/config';
import {sendCredentialInvite} from '../lib/email';

if (require.main === module) {
  const [, , email, token, inviteId, username] = process.argv;

  if (!email || !token || !inviteId || !username) {
    console.error('❌ Missing required arguments: email, token, inviteId, username');
    process.exit(1);
  }

  sendCredentialInvite(email, token, inviteId, username)
    .then(() => {
      console.log('✅ Email sent successfully');
    })
    .catch(error => {
      console.error('❌ Error sending email:', error);
    });
}
