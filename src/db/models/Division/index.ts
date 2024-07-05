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

export interface DivisionAttributes {
  id: string;
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
      }
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
