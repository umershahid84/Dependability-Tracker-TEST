"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSequelize = exports.defaultSequelizeConfig = exports.defaultDbOptions = void 0;
const sequelize_1 = require("sequelize");
exports.defaultDbOptions = {
    host: 'localhost',
    dialect: 'mysql',
    port: 3306
};
exports.defaultSequelizeConfig = {
    dbName: 'dependability_tracker_db',
    dbUser: 'root',
    dbPassword: 'password',
    options: exports.defaultDbOptions
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
const getSequelize = (props) => new sequelize_1.Sequelize(props?.dbName ?? process.env.DB_NAME ?? exports.defaultSequelizeConfig.dbName, props?.dbUser ?? process.env.DB_USER ?? exports.defaultSequelizeConfig.dbUser, props?.dbPassword ?? process.env.DB_PASS ?? exports.defaultSequelizeConfig.dbPassword, {
    host: props?.options?.host ?? process.env.DB_HOST ?? exports.defaultDbOptions.host,
    port: parseInt(props?.options?.port?.toString() ?? process.env.DB_PORT ?? exports.defaultDbOptions.port.toString()),
    dialect: props?.options?.dialect ??
        process.env.DB_DIALECT ??
        exports.defaultDbOptions.dialect
});
exports.getSequelize = getSequelize;
/**
 * The default sequelize object with default values
 */
const sequelize = (0, exports.getSequelize)();
/**
 * The default sequelize object with default values
 */
exports.default = sequelize;
