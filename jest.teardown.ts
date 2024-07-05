import sequelize from './src/db/connection';

export const globalTeardown = async () => {
  await sequelize.drop();
  await sequelize.close();
};

export default globalTeardown;
