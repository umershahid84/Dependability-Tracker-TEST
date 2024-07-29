import {
  Model,
  DataTypes,
  InferAttributes,
  CreationOptional,
  InferCreationAttributes
} from 'sequelize';
import sequelize from '../../connection';
import { uuid } from '../../../utils/shared/uuid';

export interface DivisionAttributes {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

export type DivisionCreationAttributes = {
  id?: string;
  name: string;
  createdAt?: Date;
  updatedAt?: Date;
};

export enum DefaultDivisions {
  PUBLIC_PARKING = 'Public Parking',
  EMPLOYEE_PARKING = 'Employee Parking',
  GROUND_TRANSPORTATION = 'Ground Transportation'
}

class Division extends Model<InferAttributes<Division>, InferCreationAttributes<Division>> {
  // model attributes
  declare id: CreationOptional<string>;
  declare name: string;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

Division.init(
  {
    id: {
      type: DataTypes.STRING,
      defaultValue: uuid,
      allowNull: false,
      primaryKey: true,
      validate: {
        isUUID: 4
      },
      unique: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE
  },
  {
    sequelize,
    paranoid: true,
    modelName: 'division',
    tableName: 'divisions',
    underscored: true
  }
);

export default Division;
