import {
  Model,
  Optional,
  DataTypes,
  InferAttributes,
  CreationOptional,
  InferCreationAttributes
} from 'sequelize';
import sequelize from '../../connection';

export interface LeaveTypeAttributes {
  id: number;
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
  declare id: CreationOptional<number>;
  declare reason: string;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

LeaveType.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true
    },
    reason: {
      type: DataTypes.STRING,
      allowNull: false
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
