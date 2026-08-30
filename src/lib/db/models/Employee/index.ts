import {
  Model,
  DataTypes,
  ForeignKey,
  Association,
  NonAttribute,
  InferAttributes,
  CreationOptional,
  InferCreationAttributes,
  HasManyHasAssociationMixin,
  HasManyAddAssociationMixin,
  HasManyAddAssociationsMixin,
  HasManyHasAssociationsMixin,
  HasManySetAssociationsMixin,
  HasManyGetAssociationsMixin,
  HasManyRemoveAssociationMixin,
  HasManyCountAssociationsMixin,
  HasManyCreateAssociationMixin,
  HasManyRemoveAssociationsMixin
} from 'sequelize';
import CallOut, { CallOutAttributes, CallOutWithAssociations } from '../Callout';
import sequelize from '../../connection';
import { DivisionAttributes } from '../Division';
import { uuid } from '../../../utils/shared/uuid';
import {EmployeeScheduleAttributes} from '../EmployeeSchedule';

export interface EmployeeAttributes {
  id: string;
  name: string;
  is_active: boolean;
  createdAt: Date;
  updatedAt: Date;
  division_ids: string[];
  // Only meaningful for Employee Parking employees; one of shuttleNumberOptions or null.
  shuttle_number: string | null;
  callouts?: (CallOutAttributes | CallOutWithAssociations)[];
  activeSchedule?: EmployeeScheduleAttributes | null;
}

export type EmployeeWithAssociations = {
  id: string;
  name: string;
  is_active: boolean;
  role?: string;
  createdAt: Date;
  updatedAt: Date;
  divisions: DivisionAttributes[];
  shuttle_number?: string | null;
  callouts?: (CallOutAttributes | CallOutWithAssociations)[];
  activeSchedule?: EmployeeScheduleAttributes | null;
};

export type EmployeeCreationAttributes = {
  id?: string;
  name: string;
  is_active?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  division_ids: string[];
  shuttle_number?: string | null;
};

class Employee
  extends Model<
    InferAttributes<Employee, { omit: 'divisions' | 'callouts' }>,
    InferCreationAttributes<Employee, { omit: 'divisions' | 'callouts' }>
  >
  implements EmployeeAttributes {
  // model attributes
  declare name: string;
  declare id: CreationOptional<string>;
  declare is_active: CreationOptional<boolean>;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
  declare division_ids: ForeignKey<string[]>;
  declare shuttle_number: CreationOptional<string | null>;

  // model inclusions

  declare divisions?: NonAttribute<DivisionAttributes[]>;

  declare getCallOuts: HasManyGetAssociationsMixin<CallOut>;
  declare setCallOuts: HasManySetAssociationsMixin<CallOut, string>;
  declare addCallOut: HasManyAddAssociationMixin<CallOut, string>;
  declare addCallOuts: HasManyAddAssociationsMixin<CallOut, string>;
  declare createCallOut: HasManyCreateAssociationMixin<CallOut, 'employee_id'>;
  declare hasCallOut: HasManyHasAssociationMixin<CallOut, string>;
  declare hasCallOuts: HasManyHasAssociationsMixin<CallOut, string>;
  declare countCallOuts: HasManyCountAssociationsMixin;
  declare removeCallOut: HasManyRemoveAssociationMixin<CallOut, string>;
  declare removeCallOuts: HasManyRemoveAssociationsMixin<CallOut, string>;

  declare role?: NonAttribute<string>;
  declare callouts?: NonAttribute<CallOut[]>;

  // model associations
  static readonly associations: {
    callouts: Association<Employee, CallOut>;
  };
}

Employee.init(
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
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
    division_ids: {
      // @ts-expect-error - this is a JSON column
      type: DataTypes.JSON(DataTypes.STRING),
      allowNull: true,
      defaultValue: []
    },
    shuttle_number: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: null
    }
  },
  {
    sequelize,
    paranoid: true,
    modelName: 'employee',
    tableName: 'employees',
    underscored: true
  }
);

export default Employee;
