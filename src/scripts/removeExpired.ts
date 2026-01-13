import 'dotenv/config';
import { Op } from 'sequelize';
import { logTemplate } from '../lib/utils/server';
import { CreateCredentialsInvite, LoginCredential, connection } from '../lib/db';
import { isPasswordExpired } from '../lib/db/controller/LoginCredential/helpers';
import { getPasswordExpiryDays } from '../lib/utils/server/config/passwordExpiry';


const removeExpired = async () => {
  let inviteCount = 0;
  let expiredPasswordCount = 0;
  const now = new Date();
  console.log(logTemplate(`\n🔎 Looking for expired invites and passwords...`));

  try {
    // get the db connection
    // connect to the database and sync the models
    await connection.sync();

    // find all expired invites and delete them
    inviteCount = await CreateCredentialsInvite.destroy({
      where: {
        expires_at: {
          [Op.lt]: now
        }
      }
    });

    // Check for expired passwords
    // Note: For very large datasets, consider using a database-level date calculation
    // For typical use cases, this in-memory filter is sufficient
    const expiryDays = getPasswordExpiryDays();
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() - expiryDays);
    
    // More efficient: use database query for counting
    expiredPasswordCount = await LoginCredential.count({
      where: {
        password_changed_at: {
          [Op.lt]: expiryDate
        }
      }
    });

    if (expiredPasswordCount > 0) {
      console.log(logTemplate(`\n⚠️  Found ${expiredPasswordCount} accounts with expired passwords.`));
      console.log(logTemplate(`   Users will be required to reset their passwords on next login.`));
    }
  } catch (error) {
    // 1146 means the table doesn't exist, which is fine bc that means no tables
    // have been created yet
    // @ts-ignore
    if (error?.parent?.errno !== 1146) {
      // @ts-ignore
      console.error(logTemplate(`❌ Error removing expired invites: ${error?.message ?? 'Unknown error'}`, 'error'));
    }
  }

  console.log(logTemplate(`\n⌛ Removed ${inviteCount} expired invites.`));
  if (expiredPasswordCount > 0) {
    console.log(logTemplate(`\n🔐 Detected ${expiredPasswordCount} expired passwords.`));
  }
};

if (require.main === module) {
  const [, , ...args] = process.argv;

  // run every 5 minutes by default, expects an interval in milliseconds
  const minutes = 5;
  const intervalInMs = minutes * 60 * 1000;

  const interval = args[0] ? parseInt(args[0], 10) : intervalInMs;

  console.log(logTemplate(`\n🕰️ Removing expired entries every ${interval / 1000 / 60} minutes`));

  removeExpired();
  setInterval(() => {
    removeExpired();
  }, interval);
}
