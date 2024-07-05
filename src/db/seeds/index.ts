import sequelize from '../connection';
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
  seedDatabase();
}
