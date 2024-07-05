import {
  Model,
  Optional,
  DataTypes,
  ForeignKey,
  NonAttribute,
  InferAttributes,
  CreationOptional,
  InferCreationAttributes
} from 'sequelize';
import bcrypt from 'bcrypt';
import Supervisor from '../Supervisor';
import sequelize from '../../connection';
import {uuid} from '../../../utils/uuid';

export interface LoginCredentialsAttributes {
  id: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
  password: string;
  supervisor_id: ForeignKey<string>;
}

export interface LoginCredentialsWithAssociations {
  id: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
  password: string;
  supervisor_info: Supervisor;
}

export const hashPassword = async (password: string): Promise<string> => {
  // istanbul ignore next
  return await bcrypt.hash(password, parseInt(process.env.SALT_ROUNDS ?? '11'));
};

export interface LoginCredentialsCreationAttributes
  extends Optional<LoginCredentialsAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

class LoginCredential
  extends Model<
    InferAttributes<LoginCredential, {omit: 'supervisor_info'}>,
    InferCreationAttributes<LoginCredential, {omit: 'supervisor_info'}>
  >
  implements LoginCredentialsAttributes
{
  // model attributes
  declare id: CreationOptional<string>;
  declare email: string;
  declare password: string;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
  declare supervisor_id: ForeignKey<string>;

  // model associations
  declare supervisor_info?: NonAttribute<Supervisor>;

  // model class methods
  comparePassword(password: string): NonAttribute<boolean> {
    // istanbul ignore next
    return bcrypt.compareSync(password, this.password);
  }
}

// configure model
LoginCredential.init(
  {
    id: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: uuid,
      primaryKey: true,
      validate: {
        isUUID: 4
      }
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
    supervisor_id: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isUUID: 4
      }
    }
  },
  {
    // hash password before creating and updating
    hooks: {
      async beforeCreate(loginCredential): Promise<void> {
        loginCredential.password = await hashPassword(loginCredential.password);
      },
      // istanbul ignore next
      async beforeUpdate(loginCredential): Promise<void> {
        loginCredential.password = await hashPassword(loginCredential.password);
      }
    },
    sequelize,
    modelName: 'login_credential',
    tableName: 'login_credentials',
    underscored: true
  }
);

export default LoginCredential;
