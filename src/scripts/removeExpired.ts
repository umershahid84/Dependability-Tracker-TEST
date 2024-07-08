import 'dotenv/config';
import {Op} from 'sequelize';
import {getSequelize, CreateCredentialsInvite} from '../db';

const removeExpired = async () => {
  let count = 0;
  const now = new Date();
  console.log(`\n🔎 Looking for expired invites...`);

  try {
    // get the db connection
    const connection = getSequelize();
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
      console.error(`❌ Error removing expired invites: ${error?.message ?? 'Unknown error'}`);
    }
  }

  console.log(`\n⌛ Removed ${count} expired invites.`);
};

if (require.main === module) {
  const [, , ...args] = process.argv;

  // run every minute by default, expects an interval in milliseconds
  const intervalInMs: number = parseInt(args[0], 10) || 60000;
  removeExpired();
  setInterval(() => {
    removeExpired();
  }, intervalInMs);
}
