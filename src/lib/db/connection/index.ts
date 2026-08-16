import {DataTypes, Dialect, Sequelize} from 'sequelize';

export type SequelizeConfig = {
  dbName: string;
  dbUser: string;
  dbPassword: string;
  options?: DbOptionsConfig;
};

export type DbOptionsConfig = {
  host: string;
  dialect: Dialect;
  port: number;
};

export const defaultDbOptions: DbOptionsConfig = {
  host: 'localhost',
  dialect: 'mysql',
  port: 3306
};

export const defaultSequelizeConfig: SequelizeConfig = {
  dbName: 'dependability_tracker_db',
  dbUser: 'root',
  dbPassword: 'password',
  options: defaultDbOptions
};

/**
 * Creates a new instance of the sequelize object
 *
 * @param props - an optional {@link SequelizeConfig} object to override the default values
 *
 * Uses environment variables to set the database name, user, password, host, port, and dialect.
 * Falls back to the default values if the environment variables are not set. By default the
 * database credentials will likely be incorrect, so it is recommended to set the following
 * environment variables, be sure to replace the <values> with your own credentials:
 *
 * ```bash
 * DB_NAME=<database name>
 * DB_USER=<database user>
 * DB_PASS=<database password>
 * DB_HOST=<database host>
 * DB_PORT=<database port>
 * DB_DIALECT=<database dialect>
 * ```
 *
 * The default values are:
 * - dbName: 'dependability_tracker_db'
 * - dbUser: 'root'
 * - dbPassword: 'password'
 * - options: {
 *     host: 'localhost',
 *     dialect: 'mysql',
 *     port: 3306
 *  }
 *
 * @example - Use with the default values or values from the environment variables
 * ```typescript
 * const sequelize: Sequelize = getSequelize();
 * ```
 *
 *
 *
 * @example - Use with overriding the default values with a {@link SequelizeConfig} object
 * ```typescript
 * const sequelizeConfig: SequelizeConfig = {
 *  dbName: 'dependability_tracker_db',
 *  dbUser: 'root',
 *  dbPassword: 'password',
 *  options: {
 *      host: 'localhost',
 *      dialect: 'mysql',
 *      port: 3306
 *  }
 * };
 *
 * const sequelize: Sequelize = getSequelize(sequelizeConfig);
 * ```
 *
 * @returns a new instance of the sequelize object
 */
export function getSequelize(props?: SequelizeConfig): Sequelize {
  return new Sequelize(
    props?.dbName ?? process.env.DB_NAME ?? defaultSequelizeConfig.dbName,
    props?.dbUser ?? process.env.DB_USER ?? defaultSequelizeConfig.dbUser,
    props?.dbPassword ?? process.env.DB_PASS ?? defaultSequelizeConfig.dbPassword,
    {
      logging: false,
      host: props?.options?.host ?? process.env.DB_HOST ?? defaultDbOptions.host,
      port: parseInt(
        props?.options?.port?.toString() ?? process.env.DB_PORT ?? defaultDbOptions.port.toString()
      ),
      dialect:
        props?.options?.dialect ??
        (process.env.DB_DIALECT as Dialect | undefined) ??
        defaultDbOptions.dialect,
      pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
      },
      // CRITICAL: Tell Sequelize to NOT convert dates to UTC
      // This makes dates timezone-agnostic - they're stored exactly as provided
      timezone: '+00:00', // Store dates as-is without timezone conversion
      dialectOptions: {
        timezone: '+00:00' // Tell MySQL driver to not convert either
        // This makes the connection timezone-neutral
      }
    }
  );
}

export const ensureCalloutShiftDateToColumn = async (db: Sequelize): Promise<void> => {
  const dialect = db.getDialect();
  if (dialect !== 'mysql' && dialect !== 'mariadb') {
    return;
  }

  try {
    const queryInterface = db.getQueryInterface();
    const tableDefinition = await queryInterface.describeTable('callouts');

    if (!tableDefinition.shift_date_to) {
      try {
        await queryInterface.addColumn('callouts', 'shift_date_to', {
          type: DataTypes.DATE,
          allowNull: true
        });
      } catch (error) {
        const dbError = error as {
          original?: {code?: string};
          parent?: {code?: string};
        };
        const code = dbError.original?.code ?? dbError.parent?.code;
        if (code !== 'ER_DUP_FIELDNAME') {
          throw error;
        }
      }
    }
  } catch (error) {
    const dbError = error as {
      original?: {code?: string};
      parent?: {code?: string};
    };
    const code = dbError.original?.code ?? dbError.parent?.code;
    if (code !== 'ER_NO_SUCH_TABLE') {
      throw error;
    }
  }
};

export const ensureCalloutShiftTypeColumn = async (db: Sequelize): Promise<void> => {
  const dialect = db.getDialect();
  if (dialect !== 'mysql' && dialect !== 'mariadb') {
    return;
  }

  try {
    const queryInterface = db.getQueryInterface();
    const tableDefinition = await queryInterface.describeTable('callouts');

    if (!tableDefinition.shift_type) {
      try {
        await queryInterface.addColumn('callouts', 'shift_type', {
          type: DataTypes.STRING,
          allowNull: true
        });
      } catch (error) {
        const dbError = error as {
          original?: {code?: string};
          parent?: {code?: string};
        };
        const code = dbError.original?.code ?? dbError.parent?.code;
        if (code !== 'ER_DUP_FIELDNAME') {
          throw error;
        }
      }
    }
  } catch (error) {
    const dbError = error as {
      original?: {code?: string};
      parent?: {code?: string};
    };
    const code = dbError.original?.code ?? dbError.parent?.code;
    if (code !== 'ER_NO_SUCH_TABLE') {
      throw error;
    }
  }
};

export const ensureEmployeeScheduleDaysOffColumn = async (db: Sequelize): Promise<void> => {
  const dialect = db.getDialect();
  if (dialect !== 'mysql' && dialect !== 'mariadb') {
    return;
  }

  try {
    const queryInterface = db.getQueryInterface();
    const tableDefinition = await queryInterface.describeTable('employee_schedules');

    if (!tableDefinition.days_off) {
      try {
        await queryInterface.addColumn('employee_schedules', 'days_off', {
          type: DataTypes.JSON,
          allowNull: true
        });
      } catch (error) {
        const dbError = error as {
          original?: {code?: string};
          parent?: {code?: string};
        };
        const code = dbError.original?.code ?? dbError.parent?.code;
        if (code !== 'ER_DUP_FIELDNAME') {
          throw error;
        }
      }
    }
  } catch (error) {
    const dbError = error as {
      original?: {code?: string};
      parent?: {code?: string};
    };
    const code = dbError.original?.code ?? dbError.parent?.code;
    if (code !== 'ER_NO_SUCH_TABLE') {
      throw error;
    }
  }
};

export const ensureCalloutEditedBySupervisorColumn = async (db: Sequelize): Promise<void> => {
  const dialect = db.getDialect();
  if (dialect !== 'mysql' && dialect !== 'mariadb') {
    return;
  }

  try {
    const queryInterface = db.getQueryInterface();
    const tableDefinition = await queryInterface.describeTable('callouts');

    if (!tableDefinition.edited_by_supervisor_id) {
      try {
        await queryInterface.addColumn('callouts', 'edited_by_supervisor_id', {
          type: DataTypes.STRING,
          allowNull: true
        });
      } catch (error) {
        const dbError = error as {
          original?: {code?: string};
          parent?: {code?: string};
        };
        const code = dbError.original?.code ?? dbError.parent?.code;
        if (code !== 'ER_DUP_FIELDNAME') {
          throw error;
        }
      }
    }
  } catch (error) {
    const dbError = error as {
      original?: {code?: string};
      parent?: {code?: string};
    };
    const code = dbError.original?.code ?? dbError.parent?.code;
    if (code !== 'ER_NO_SUCH_TABLE') {
      throw error;
    }
  }
};

export const ensureEmployeeIsActiveColumn = async (db: Sequelize): Promise<void> => {
  const dialect = db.getDialect();
  if (dialect !== 'mysql' && dialect !== 'mariadb') {
    return;
  }

  try {
    const queryInterface = db.getQueryInterface();
    const tableDefinition = await queryInterface.describeTable('employees');

    if (!tableDefinition.is_active) {
      try {
        await queryInterface.addColumn('employees', 'is_active', {
          type: DataTypes.BOOLEAN,
          allowNull: false,
          defaultValue: true
        });
      } catch (error) {
        const dbError = error as {
          original?: {code?: string};
          parent?: {code?: string};
        };
        const code = dbError.original?.code ?? dbError.parent?.code;
        if (code !== 'ER_DUP_FIELDNAME') {
          throw error;
        }
      }
    }
  } catch (error) {
    const dbError = error as {
      original?: {code?: string};
      parent?: {code?: string};
    };
    const code = dbError.original?.code ?? dbError.parent?.code;
    if (code !== 'ER_NO_SUCH_TABLE') {
      throw error;
    }
  }
};

/**
 * The default sequelize object with default values
 */
const sequelize: Sequelize = getSequelize();

/**
 * The default sequelize object with default values
 */
export default sequelize;
