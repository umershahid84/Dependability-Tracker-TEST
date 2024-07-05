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
import LeaveType from '../LeaveType';
import Supervisor from '../Supervisor';
import {uuid} from '../../../utils/uuid';
import sequelize from '../../connection';

export interface CallOutAttributes {
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
}

export interface CallOutWithAssociations {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  shift_date: Date;
  shift_time: Date;
  callout_date: Date;
  callout_time: Date;
  supervisor_comments: string;
  left_early_mins: number | null;
  arrived_late_mins: number | null;
  employee: Employee;
  leaveType: LeaveType;
  supervisor: Supervisor;
}

export interface CallOutCreationAttributes
  extends Optional<CallOutAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

class CallOut
  extends Model<InferAttributes<CallOut>, InferCreationAttributes<CallOut>>
  implements CallOutAttributes
{
  // model attributes
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

  // associations
  declare employee?: NonAttribute<Employee>;
  declare leaveType?: NonAttribute<LeaveType>;
  declare supervisor?: NonAttribute<Supervisor>;
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
      }
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
      }
    },
    supervisor_id: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isUUID: 4
      }
    },
    leave_type_id: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isUUID: 4
      }
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE
  },
  {
    sequelize,
    modelName: 'callout',
    tableName: 'callouts',
    underscored: true
  }
);

export default CallOut;
