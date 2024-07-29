import 'dotenv/config';
import sequelize from '../lib/db/connection';
import seedCallOuts from '../lib/db/seeds/callouts';
import seedEmployees from '../lib/db/seeds/employees';
import seedDivisions from '../lib/db/seeds/divisions';
import seedLeaveTypes from '../lib/db/seeds/leaveTypes';
import seedSupervisors from '../lib/db/seeds/supervisors';
import seedCredentialInvites from '../lib/db/seeds/credentialInvites';

export const seedDatabase = async () => {
  try {
    console.log('\n🌱 Seeding database...');
    await sequelize.sync({force: true});
    // run these concurrently
    await Promise.all([seedDivisions(), seedLeaveTypes()]);
    // cant seed employees until divisions are seeded
    await seedEmployees();
    // cant seed supervisors until employees are seeded
    await seedSupervisors();
    console.log('✅ Database seeded');
  } catch (error) {
    console.error('❌ Error seeding database:', error);
  }
};

// if this file is run directly, seed the database
if (require.main === module) {
  const [, , ...args] = process.argv;

  (async () => {
    await seedDatabase();
    // seed callouts only in development if the callouts flag is passed
    if (args.includes('callouts') && process.env.NODE_ENV !== 'production') {
      console.log('\n\nSeeding CallOuts...');
      let numberOfCallOuts = parseInt(args[args.indexOf('callouts') + 1] ?? 20, 10);

      if (Number.isNaN(numberOfCallOuts)) numberOfCallOuts = 20;

      await seedCallOuts(numberOfCallOuts);
    }

    if (args.includes('credentialInvites')) {
      console.log('\n\nSeeding credential invites...');
      await seedCredentialInvites();
    }
  })();
}
