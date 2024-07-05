import {
  Model,
  Optional,
  DataTypes,
  InferAttributes,
  CreationOptional,
  InferCreationAttributes
} from 'sequelize';
import sequelize from '../../connection';

export interface DivisionAttributes {
  id: number;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface DivisionCreationAttributes
  extends Optional<DivisionAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

export enum DefaultDivisions {
  PUBLIC_PARKING = 'Public Parking',
  EMPLOYEE_PARKING = 'Employee Parking',
  GROUND_TRANSPORTATION = 'Ground Transportation'
}

class Division extends Model<InferAttributes<Division>, InferCreationAttributes<Division>> {
  // model attributes
  declare id: CreationOptional<number>;
  declare name: string;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

Division.init(
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
    updatedAt: DataTypes.DATE
  },
  {
    sequelize,
    modelName: 'division',
    tableName: 'divisions',
    underscored: true
  }
);

export default Division;
