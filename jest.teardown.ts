import sequelize from './src/lib/db/connection';

export const globalTeardown = async () => {
  await sequelize.drop();
};

export default globalTeardown;
