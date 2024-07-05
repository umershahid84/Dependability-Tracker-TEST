import {
  Model,
  DataTypes,
  ForeignKey,
  NonAttribute,
  InferAttributes,
  CreationOptional,
  InferCreationAttributes
} from 'sequelize';
import sequelize from '../../connection';
import {uuid} from '../../../utils/uuid';
import LoginCredential from '../LoginCredential';
import {EmployeeWithAssociations} from '../Employee';

export interface SupervisorAttributes {
  id: string;
  employee_id: string;
  is_admin: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export type SupervisorWithAssociations = {
  id: string;
  is_admin: boolean;
  createdAt: Date;
  updatedAt: Date;
  login_credentials?: LoginCredential;
  supervisor_info: EmployeeWithAssociations;
};

export type SupervisorCreationAttributes = {
  id?: string;
  employee_id: string;
  is_admin: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  login_credentials?: string;
};
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

  declare login_credentials?: NonAttribute<LoginCredential>;
  declare supervisor_info?: NonAttribute<EmployeeWithAssociations>;
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
      },
      unique: true
    },
    employee_id: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isUUID: 4
      },
      references: {
        model: 'employees',
        key: 'id'
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
