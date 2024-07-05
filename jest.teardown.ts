import sequelize from './src/db/connection';

export const globalTeardown = async () => {
  await sequelize.drop();
};

export default globalTeardown;
