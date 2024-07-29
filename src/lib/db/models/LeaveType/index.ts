import {
  Model,
  Optional,
  DataTypes,
  InferAttributes,
  CreationOptional,
  InferCreationAttributes
} from 'sequelize';
import sequelize from '../../connection';
import { uuid } from '../../../utils/shared/uuid';

export interface LeaveTypeAttributes {
  id: string;
  reason: string;
  createdAt: Date;
  updatedAt: Date;
}

export enum DefaultLeaveTypes {
  SICK = 'Sick',
  FCA = 'FCA',
  FMLA = 'FMLA',
  NO_CALL_NO_SHOW = 'No Call-No Show',
  BEREAVEMENT = 'Bereavement',
  LATE_ARRIVAL = 'Tardiness',
  LEFT_EARLY = 'Left Early',
  LWOP = 'LWOP',
  VACATION = 'PTO',
  PERSONAL_HOLIDAY = 'Personal Holiday',
  HOLIDAY = 'Holiday',
  HOLIDAY_OPTION = 'Holiday Opt.',
  PHEL = 'PHEL',
  JURY_DUTY = 'Jury Duty',
  MATERNITY = 'Maternity',
  PATERNITY = 'Paternity',
  MILITARY = 'Military',
  OTHER = 'Others'
}

export interface LeaveTypeCreationAttributes
  extends Optional<LeaveTypeAttributes, 'id' | 'createdAt' | 'updatedAt'> { }

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
    paranoid: true,
    modelName: 'leave_type',
    tableName: 'leave_types',
    underscored: true
  }
);

export default LeaveType;
