import { Model, DataTypes, CreationOptional, InferAttributes, InferCreationAttributes, NonAttribute, ForeignKey } from 'sequelize';
import sequelize from '../../connection';
import { uuid } from '../../../utils/shared/uuid';

class PasswordResetCode extends Model<
  InferAttributes<PasswordResetCode>,
  InferCreationAttributes<PasswordResetCode>
> {
  declare id: CreationOptional<string>;
  declare supervisor_id: string | null;
  declare email: string;
  declare code_hash: string;
  declare expires_at: Date;
  declare used?: CreationOptional<boolean>;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

PasswordResetCode.init(
  {
    id: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: uuid,
      primaryKey: true,
      validate: { isUUID: 4 },
      unique: true
    },
    supervisor_id: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: { isUUID: 4 }
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false
    },
    code_hash: {
      type: DataTypes.STRING,
      allowNull: false
    },
    expires_at: {
      type: DataTypes.DATE,
      allowNull: false
    },
    used: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE
  },
  {
    sequelize,
    modelName: 'password_reset_code',
    tableName: 'password_reset_codes',
    underscored: true
  }
);

export default PasswordResetCode;
