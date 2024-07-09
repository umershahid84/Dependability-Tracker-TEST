import 'dotenv/config';
import {seedDatabase} from './src/lib/db/seeds';
import seedCallouts from './src/lib/db/seeds/callouts';

const globalSetup = async () => {
  console.log('\nSetting up the database for tests...');
  await seedDatabase();
  await seedCallouts(20);
  console.log('Database setup complete...');
};

export default globalSetup;
