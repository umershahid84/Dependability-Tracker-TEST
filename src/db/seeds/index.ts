import 'dotenv/config';
import sequelize from '../connection';
import seedCallouts from './callouts';
import seedEmployees from './employees';
import seedDivisions from './divisions';
import seedLeaveTypes from './leaveTypes';
import seedSupervisors from './supervisors';

export const seedDatabase = async () => {
  try {
    console.log('\n🌱 Seeding database...');
    await sequelize.sync({force: true});
    // run these concurrently
    await Promise.all([seedDivisions(), seedLeaveTypes(), seedEmployees()]);
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
      const numberOfCallouts = parseInt(args[args.indexOf('callouts') + 1] ?? 20, 10);
      await seedCallouts(numberOfCallouts);
    }
  })();
}
