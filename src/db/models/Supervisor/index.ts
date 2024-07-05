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
import LoginCredential from '../LoginCredential';

export interface SupervisorAttributes {
  id: number;
  employee_id: ForeignKey<number>;
  is_admin: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface SupervisorWithAssociations {
  id: number;
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
  declare id: CreationOptional<number>;
  declare employee_id: ForeignKey<number>;
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
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true
    },
    employee_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false
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
