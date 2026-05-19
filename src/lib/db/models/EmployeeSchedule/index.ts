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

export type DaysOffType = '2_DAYS_OFF' | '3_DAYS_OFF' | '4_DAYS_OFF';
export type EmployeeStatusType = 'FULL_TIME' | 'PART_TIME';

export type EmployeeScheduleAttributes = {
  id: string;
  employee_id: string;
  shift_start_time: string;
  shift_end_time: string;
  days_off_type: DaysOffType;
  days_off: number[] | null;
  employee_status: EmployeeStatusType;
  effective_start: Date;
  effective_end: Date | null;
  is_active: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export type EmployeeScheduleCreationAttributes = {
  id?: string;
  employee_id: string;
  shift_start_time: string;
  shift_end_time: string;
  days_off_type: DaysOffType;
  days_off?: number[] | null;
  employee_status: EmployeeStatusType;
  effective_start?: Date;
  effective_end?: Date | null;
  is_active?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
};

class EmployeeSchedule
  extends Model<InferAttributes<EmployeeSchedule>, InferCreationAttributes<EmployeeSchedule>>
  implements EmployeeScheduleAttributes
{
  declare id: CreationOptional<string>;
  declare employee_id: ForeignKey<string>;
  declare shift_start_time: string;
  declare shift_end_time: string;
  declare days_off_type: DaysOffType;
  declare days_off: number[] | null;
  declare employee_status: EmployeeStatusType;
  declare effective_start: CreationOptional<Date>;
  declare effective_end: Date | null;
  declare is_active: CreationOptional<boolean>;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
  declare employee?: NonAttribute<EmployeeWithAssociations>;
}

EmployeeSchedule.init(
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
      validate: {
        isUUID: 4
      },
      references: {
        model: 'employees',
        key: 'id'
      }
    },
    shift_start_time: {
      type: DataTypes.STRING,
      allowNull: false
    },
    shift_end_time: {
      type: DataTypes.STRING,
      allowNull: false
    },
    days_off_type: {
      type: DataTypes.ENUM('2_DAYS_OFF', '3_DAYS_OFF', '4_DAYS_OFF'),
      allowNull: false
    },
    days_off: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: null
    },
    employee_status: {
      type: DataTypes.ENUM('FULL_TIME', 'PART_TIME'),
      allowNull: false
    },
    effective_start: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    effective_end: {
      type: DataTypes.DATE,
      allowNull: true
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE
  },
  {
    sequelize,
    modelName: 'employeeSchedule',
    tableName: 'employee_schedules',
    underscored: true
  }
);

export default EmployeeSchedule;
