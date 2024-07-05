import {seedDatabase} from './src/db/seeds';

const globalSetup = async () => {
  console.log('\nSetting up the database for tests...');
  await seedDatabase();
  console.log('Database setup complete...');
};

export default globalSetup;
