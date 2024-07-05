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
import Employee from '../Employee';
import sequelize from '../../connection';
import {uuid} from '../../../utils/uuid';
import LoginCredential from '../LoginCredential';

export interface SupervisorAttributes {
  id: string;
  employee_id: ForeignKey<string>;
  is_admin: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface SupervisorWithAssociations {
  id: string;
  is_admin: boolean;
  createdAt: Date;
  updatedAt: Date;
  supervisor_info: Employee;
  login_credentials?: LoginCredential;
}

export interface SupervisorCreationAttributes
  extends Optional<SupervisorAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

class Supervisor
  extends Model<
    InferAttributes<Supervisor, {omit: 'supervisor_info'}>,
    InferCreationAttributes<Supervisor, {omit: 'supervisor_info'}>
  >
  implements SupervisorAttributes
{
  // model attributes
  declare id: CreationOptional<string>;
  declare employee_id: ForeignKey<string>;
  declare is_admin: boolean;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;

  // model associations
  declare supervisor_info?: NonAttribute<Employee>;
  declare login_credentials?: NonAttribute<LoginCredential>;
}

// configure model
Supervisor.init(
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
    employee_id: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isUUID: 4
      }
    },
    is_admin: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE
  },
  {
    sequelize,
    modelName: 'supervisor',
    tableName: 'supervisors',
    underscored: true
  }
);

export default Supervisor;
