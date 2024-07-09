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
import LoginCredential from '../LoginCredential';
import {uuid} from '../../../utils/shared/uuid';
import {EmployeeWithAssociations} from '../Employee';
import {CreateCredentialsInviteWithAssociations} from '../CreateCredentialsInvite';

export interface SupervisorAttributes {
  id: string;
  employee_id: string;
  is_admin: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export type SupervisorCreationAttributes = {
  id?: string;
  employee_id: string;
  is_admin: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  login_credentials?: string;
};

export type SupervisorWithAssociations = {
  id: string;
  is_admin: boolean;
  createdAt: Date;
  updatedAt: Date;
  login_credentials?: LoginCredential;
  create_credentials_invite?: CreateCredentialsInviteWithAssociations;
  supervisor_info: EmployeeWithAssociations;
};

class Supervisor
  extends Model<
    InferAttributes<
      Supervisor,
      {omit: 'supervisor_info' | 'login_credentials' | 'create_credentials_invite'}
    >,
    InferCreationAttributes<
      Supervisor,
      {omit: 'supervisor_info' | 'login_credentials' | 'create_credentials_invite'}
    >
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
  declare create_credentials_invite?: NonAttribute<CreateCredentialsInviteWithAssociations>;
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
      allowNull: false,
      defaultValue: false
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
export type AdminSupervisor = (Supervisor | SupervisorWithAssociations | SupervisorAttributes) & {
  is_admin: true;
};
export default Supervisor;
