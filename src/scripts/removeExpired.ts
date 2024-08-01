import 'dotenv/config';
import { Op } from 'sequelize';
import { logTemplate } from '../lib/utils/server';
import { CreateCredentialsInvite, connection } from '../lib/db';


const removeExpired = async () => {
  let count = 0;
  const now = new Date();
  console.log(logTemplate(`\n🔎 Looking for expired invites...`));

  try {
    // get the db connection
    // connect to the database and sync the models
    await connection.sync();

    // find all expired invites and delete them
    count = await CreateCredentialsInvite.destroy({
      where: {
        expires_at: {
          [Op.lt]: now
        }
      }
    });
  } catch (error) {
    // 1146 means the table doesn't exist, which is fine bc that means no tables
    // have been created yet
    // @ts-ignore
    if (error?.parent?.errno !== 1146) {
      // @ts-ignore
      console.error(logTemplate(`❌ Error removing expired invites: ${error?.message ?? 'Unknown error'}`, 'error'));
    }
  }

  console.log(logTemplate(`\n⌛ Removed ${count} expired invites.`));
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
