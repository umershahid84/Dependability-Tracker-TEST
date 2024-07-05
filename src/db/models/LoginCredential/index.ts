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

export interface LoginCredentialsAttributes {
  id: number;
  email: string;
  createdAt: Date;
  updatedAt: Date;
  password: string;
  supervisor_id: ForeignKey<number>;
}

export interface LoginCredentialsWithAssociations {
  id: number;
  email: string;
  createdAt: Date;
  updatedAt: Date;
  password: string;
  supervisor_info: Supervisor;
}

export const hashPassword = async (password: string): Promise<string> => {
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
  declare id: CreationOptional<number>;
  declare email: string;
  declare password: string;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
  declare supervisor_id: ForeignKey<number>;

  // model associations
  declare supervisor_info?: NonAttribute<Supervisor>;

  // model class methods
  comparePassword(password: string): NonAttribute<boolean> {
    return bcrypt.compareSync(password, this.password);
  }
}

// configure model
LoginCredential.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true
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
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false
    }
  },
  {
    // hash password before creating and updating
    hooks: {
      async beforeCreate(loginCredential): Promise<void> {
        loginCredential.password = await hashPassword(loginCredential.password);
      },
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
