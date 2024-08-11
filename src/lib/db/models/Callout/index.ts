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
import {uuid} from '../../../utils/shared/uuid';
import {EmployeeWithAssociations} from '../Employee';
import {SupervisorWithAssociations} from '../Supervisor';
import LeaveType, {LeaveTypeAttributes} from '../LeaveType';

/**
 * Represents the attributes of a CallOut model.
 */
export type CallOutAttributes = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  shift_date: Date;
  shift_time: Date;
  callout_date: Date;
  callout_time: Date;
  employee_id: string;
  supervisor_id: string;
  leave_type_id: string;
  supervisor_comments: string;
  left_early_mins: number | null;
  arrived_late_mins: number | null;
};

/**
 * Represents the creation attributes of a CallOut model.
 */
export type CallOutCreationAttributes = {
  id?: string;
  createdAt?: Date;
  updatedAt?: Date;
  shift_date: Date;
  shift_time: Date;
  callout_date: Date;
  callout_time: Date;
  employee_id: string;
  supervisor_id: string;
  leave_type_id: string;
  supervisor_comments: string;
  left_early_mins?: number | null;
  arrived_late_mins?: number | null;
};

/**
 * Represents a CallOut model with associations.
 */
export type CallOutWithAssociations = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  shift_date: Date;
  shift_time: Date;
  callout_date: Date;
  callout_time: Date;
  supervisor_comments: string;
  left_early_mins: number | null;
  leaveType: LeaveTypeAttributes;
  arrived_late_mins: number | null;
  employee: EmployeeWithAssociations;
  supervisor: SupervisorWithAssociations;
};

class CallOut
  extends Model<InferAttributes<CallOut>, InferCreationAttributes<CallOut>>
  implements CallOutAttributes
{
  declare id: CreationOptional<string>;
  declare shift_date: Date;
  declare shift_time: Date;
  declare callout_date: Date;
  declare callout_time: Date;
  declare supervisor_comments: string;
  declare left_early_mins: number | null;
  declare arrived_late_mins: number | null;
  declare employee_id: ForeignKey<string>;
  declare supervisor_id: ForeignKey<string>;
  declare leave_type_id: ForeignKey<string>;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
  declare leaveType?: NonAttribute<LeaveType>;
  declare employee?: NonAttribute<EmployeeWithAssociations>;
  declare supervisor?: NonAttribute<SupervisorWithAssociations>;
  declare deleted_at?: Date | null;
}

// initialize model
CallOut.init(
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
    shift_date: {
      type: DataTypes.DATE,
      allowNull: false
    },
    shift_time: {
      type: DataTypes.DATE,
      allowNull: false
    },
    callout_date: {
      type: DataTypes.DATE,
      allowNull: false
    },
    callout_time: {
      type: DataTypes.DATE,
      allowNull: false
    },
    left_early_mins: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: true
    },
    arrived_late_mins: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: true
    },
    supervisor_comments: {
      type: DataTypes.STRING,
      allowNull: false
    },
    employee_id: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isUUID: 4
      },
      references: {
        model: 'employees',
        key: 'id'
      }
    },
    supervisor_id: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isUUID: 4
      },
      references: {
        model: 'supervisors',
        key: 'id'
      }
    },
    leave_type_id: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isUUID: 4
      },
      references: {
        model: 'leave_types',
        key: 'id'
      }
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE
  },
  {
    sequelize,
    paranoid: true,
    modelName: 'callout',
    tableName: 'callouts',
    underscored: true
  }
);

export default CallOut;
