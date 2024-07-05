import {
  Model,
  Optional,
  DataTypes,
  InferAttributes,
  CreationOptional,
  InferCreationAttributes
} from 'sequelize';
import sequelize from '../../connection';
import {uuid} from '../../../utils/uuid';

export interface LeaveTypeAttributes {
  id: string;
  reason: string;
  createdAt: Date;
  updatedAt: Date;
}

export enum DefaultLeaveTypes {
  SICK = 'Sick',
  HOLIDAY = 'Holiday',
  VACATION = 'Vacation',
  PTO = 'Paid Time Off',
  JURY_DUTY = 'Jury Duty',
  MATERNITY = 'Maternity',
  PATERNITY = 'Paternity',
  LEFT_EARLY = 'Left Early',
  LWOP = 'Leave Without Pay',
  BEREAVEMENT = 'Bereavement',
  LATE_ARRIVAL = 'Late Arrival',
  FCA = 'Family Care Assistance',
  FMLA = 'Family Medical Leave Act',
  NO_CALL_NO_SHOW = 'No Call No Show',
  PHEL = 'Paid Health Emergency Leave',
  PERSONAL_HOLIDAY = 'Personal Holiday',
  HOLIDAY_OPTIONAL = 'Optional Holiday'
}

export interface LeaveTypeCreationAttributes
  extends Optional<LeaveTypeAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

class LeaveType extends Model<InferAttributes<LeaveType>, InferCreationAttributes<LeaveType>> {
  // model attributes
  declare id: CreationOptional<string>;
  declare reason: string;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

LeaveType.init(
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
    reason: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: true
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: true
    }
  },
  {
    sequelize,
    modelName: 'leave_type',
    tableName: 'leave_types',
    underscored: true
  }
);

export default LeaveType;
