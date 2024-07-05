import {
  Model,
  Optional,
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
import CallOut from '../Callout';
import Division from '../Division';
import sequelize from '../../connection';

export interface EmployeeAttributes {
  id: number;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  division_ids: ForeignKey<number[]>;
}

export interface EmployeeWithAssociations {
  id: number;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  divisions: Division[];
}

export interface EmployeeCreationAttributes
  extends Optional<EmployeeAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

class Employee
  extends Model<
    InferAttributes<Employee, {omit: 'divisions' | 'callOuts'}>,
    InferCreationAttributes<Employee, {omit: 'divisions' | 'callOuts'}>
  >
  implements EmployeeAttributes
{
  // model attributes
  declare name: string;
  declare id: CreationOptional<number>;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
  declare division_ids: ForeignKey<number[]>;

  // model inclusions
  declare getDivisions: HasManyGetAssociationsMixin<Division>;
  declare setDivisions: HasManySetAssociationsMixin<Division, number>;
  declare addDivision: HasManyAddAssociationMixin<Division, number>;
  declare addDivisions: HasManyAddAssociationsMixin<Division, number>;
  declare createDivision: HasManyCreateAssociationMixin<Division>;
  declare hasDivision: HasManyHasAssociationMixin<Division, number>;
  declare hasDivisions: HasManyHasAssociationsMixin<Division, number>;
  declare countDivisions: HasManyCountAssociationsMixin;
  declare removeDivision: HasManyRemoveAssociationMixin<Division, number>;
  declare removeDivisions: HasManyRemoveAssociationsMixin<Division, number>;

  declare divisions?: NonAttribute<Division[]>;

  declare getCallOuts: HasManyGetAssociationsMixin<CallOut>;
  declare setCallOuts: HasManySetAssociationsMixin<CallOut, number>;
  declare addCallOut: HasManyAddAssociationMixin<CallOut, number>;
  declare addCallOuts: HasManyAddAssociationsMixin<CallOut, number>;
  declare createCallOut: HasManyCreateAssociationMixin<CallOut, 'employee_id'>;
  declare hasCallOut: HasManyHasAssociationMixin<CallOut, number>;
  declare hasCallOuts: HasManyHasAssociationsMixin<CallOut, number>;
  declare countCallOuts: HasManyCountAssociationsMixin;
  declare removeCallOut: HasManyRemoveAssociationMixin<CallOut, number>;
  declare removeCallOuts: HasManyRemoveAssociationsMixin<CallOut, number>;

  declare callOuts?: NonAttribute<CallOut[]>;

  // model associations
  static readonly associations: {
    divisions: Association<Employee, Division>;
    callOuts: Association<Employee, CallOut>;
  };
}

Employee.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
    division_ids: {
      // @ts-expect-error - this is a JSON column
      type: DataTypes.JSON(DataTypes.INTEGER),
      allowNull: true
    }
  },
  {
    sequelize,
    modelName: 'employee',
    tableName: 'employees',
    underscored: true
  }
);

export default Employee;
