import {
  Model,
  DataTypes,
  ForeignKey,
  NonAttribute,
  InferAttributes,
  CreationOptional,
  InferCreationAttributes
} from 'sequelize';
import bcrypt from 'bcrypt';
import sequelize from '../../connection';
import {uuid} from '../../../utils/shared/uuid';
import {SupervisorWithAssociations} from '../Supervisor';

export type LoginCredentialsAttributes = {
  id: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
  password: string;
  is_default?: boolean;
  supervisor_id: ForeignKey<string>;
};

export type LoginCredentialsCreationAttributes = {
  id?: string;
  email: string;
  password: string;
  createdAt?: Date;
  updatedAt?: Date;
  is_default?: boolean;
  supervisor_id: string;
  invite_token?: string;
};

export type LoginCredentialsWithAssociations = {
  id: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
  password: string;
  is_default?: boolean;
  supervisor_info: SupervisorWithAssociations;
  comparePassword: (password: string) => boolean;
};

export const hashPassword = async (password: string): Promise<string> => {
  // istanbul ignore next
  return await bcrypt.hash(password, parseInt(process.env.SALT_ROUNDS ?? '11'));
};

class LoginCredential
  extends Model<
    InferAttributes<LoginCredential, {omit: 'supervisor_info'}>,
    InferCreationAttributes<LoginCredential, {omit: 'supervisor_info'}>
  >
  implements LoginCredentialsAttributes
{
  // model attributes
  declare email: string;
  declare password: string;
  declare id: CreationOptional<string>;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
  declare supervisor_id: ForeignKey<string>;
  declare is_default?: CreationOptional<boolean>;

  // model associations
  declare supervisor_info?: NonAttribute<SupervisorWithAssociations>;

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
      },
      unique: true
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true
      }
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
      },
      unique: true,
      references: {
        model: 'supervisors',
        key: 'id'
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
