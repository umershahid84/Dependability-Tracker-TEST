import {Sequelize} from 'sequelize';
import type {SequelizeConfig, DbOptionsConfig} from './index';
import sequelize, {getSequelize, defaultDbOptions, defaultSequelizeConfig} from './index';

// Helper function to save the environment variables
const saveEnvs = () => {
  return {...process.env};
};

// Helper function to delete the environment variables
const deleteEnvs = (): void => {
  delete process.env.DB_NAME;
  delete process.env.DB_USER;
  delete process.env.DB_PASS;
  delete process.env.DB_HOST;
  delete process.env.DB_PORT;
  delete process.env.DB_DIALECT;
};

describe('Database Connection Module', () => {
  it('should return a default sequelize object with the env values', () => {
    expect(sequelize).toBeInstanceOf(Sequelize);
    expect(sequelize).toHaveProperty('config');
    expect(sequelize.config).toHaveProperty('host', process.env.DB_HOST);
    expect(sequelize.config).toHaveProperty('port', parseInt(process.env.DB_PORT ?? '0'));
    // @ts-expect-error - the options property does exist not sure why it's throwing an error
    expect(sequelize.options).toHaveProperty('dialect', process.env.DB_DIALECT);
    expect(sequelize.config).toHaveProperty('database', process.env.DB_NAME);
    expect(sequelize.config).toHaveProperty('username', process.env.DB_USER);
    expect(sequelize.config).toHaveProperty('password', process.env.DB_PASS);

    expect.assertions(8);
  });

  it('should create a new sequelize object with the default values if the environment variables are missing', () => {
    // save the environment variables
    const savedEnvs = saveEnvs();
    // remove the env variables so that the default values are used
    deleteEnvs();

    // create a new sequelize object using the default values
    const sequelize: Sequelize = getSequelize();

    // Assert the values are as expected
    expect(sequelize).toBeInstanceOf(Sequelize);
    expect(sequelize).toHaveProperty('config');
    expect(sequelize.config).toHaveProperty('host', defaultDbOptions.host);
    expect(sequelize.config).toHaveProperty('port', defaultDbOptions.port);
    // @ts-expect-error - the options property does exist not sure why it's throwing an error
    expect(sequelize.options).toHaveProperty('dialect', defaultDbOptions.dialect);
    expect(sequelize.config).toHaveProperty('database', defaultSequelizeConfig.dbName);
    expect(sequelize.config).toHaveProperty('username', defaultSequelizeConfig.dbUser);
    expect(sequelize.config).toHaveProperty('password', defaultSequelizeConfig.dbPassword);

    expect.assertions(8);

    // restore the env variables
    process.env = savedEnvs;
  });

  it('should create a new sequelize object with the provided values with environment variables present', () => {
    // configuration information
    const sequelizeConfig: SequelizeConfig = {
      dbName: 'test_db',
      dbUser: 'test_user',
      dbPassword: 'test_password',
      options: {
        host: 'localhost',
        dialect: 'mysql',
        port: 3306
      } as DbOptionsConfig
    };

    // create a new sequelize object using the provided values
    const sequelize: Sequelize = getSequelize(sequelizeConfig);

    // Assert the values are as expected
    expect(sequelize).toBeInstanceOf(Sequelize);
    expect(sequelize).toHaveProperty('config');
    expect(sequelize.config).toHaveProperty('host', sequelizeConfig?.options?.host as string);
    expect(sequelize.config).toHaveProperty('port', sequelizeConfig?.options?.port as number);
    // @ts-expect-error - the options property does exist not sure why it's throwing an error
    expect(sequelize.options).toHaveProperty(
      'dialect',
      sequelizeConfig?.options?.dialect as string
    );
    expect(sequelize.config).toHaveProperty('database', sequelizeConfig.dbName);
    expect(sequelize.config).toHaveProperty('username', sequelizeConfig.dbUser);
    expect(sequelize.config).toHaveProperty('password', sequelizeConfig.dbPassword);

    expect.assertions(8);
  });

  it('should create a new sequelize object with the provided values with environment variables missing', () => {
    const savedEnvs = saveEnvs();
    deleteEnvs();

    const sequelizeConfig: SequelizeConfig = {
      dbName: 'test_db',
      dbUser: 'test_user',
      dbPassword: 'test_password',
      options: {
        host: 'localhost',
        dialect: 'mysql',
        port: 3306
      } as DbOptionsConfig
    };

    const sequelize: Sequelize = getSequelize(sequelizeConfig);

    // Assert the values are as expected
    expect(sequelize).toBeInstanceOf(Sequelize);
    expect(sequelize).toHaveProperty('config');
    expect(sequelize.config).toHaveProperty('host', sequelizeConfig?.options?.host as string);
    expect(sequelize.config).toHaveProperty('port', sequelizeConfig?.options?.port as number);
    // @ts-expect-error - the options property does exist not sure why it's throwing an error
    expect(sequelize.options).toHaveProperty(
      'dialect',
      sequelizeConfig?.options?.dialect as string
    );
    expect(sequelize.config).toHaveProperty('database', sequelizeConfig.dbName);
    expect(sequelize.config).toHaveProperty('username', sequelizeConfig.dbUser);
    expect(sequelize.config).toHaveProperty('password', sequelizeConfig.dbPassword);

    expect.assertions(8);

    // restore the env variables
    process.env = savedEnvs;
  });
});

describe('Sequelize Connection', () => {
  it('should connect to the database if the database exists', async () => {
    try {
      // throws an error if the authentication fails
      await sequelize.authenticate();
      expect(true).toBe(true);
    } catch (error) {
      // should not reach here
      expect(error).toBeUndefined();
    }

    expect.assertions(1);
  });

  it('should not connect to the database if the database does not exist, and throw an error', async () => {
    // change the database name to a non-existent database
    process.env.DB_NAME = 'non_existent_db';

    // create a new sequelize object with the new database name
    const sequelize: Sequelize = getSequelize();

    try {
      // try to authenticate with the new sequelize object
      await sequelize.authenticate();
      // should not reach here
      expect(false).toBe(true);
    } catch (error) {
      // the error should be defined
      expect(error).toBeDefined();
    }

    expect.assertions(1);
  });
});
