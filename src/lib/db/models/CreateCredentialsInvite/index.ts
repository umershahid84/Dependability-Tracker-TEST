import {
  Model,
  DataTypes,
  ForeignKey,
  NonAttribute,
  InferAttributes,
  CreationOptional,
  InferCreationAttributes
} from 'sequelize';
import crypto from 'crypto';
import sequelize from '../../connection';
import {uuid} from '../../../utils/shared/uuid';
import Supervisor, {AdminSupervisor, SupervisorWithAssociations} from '../Supervisor';

export interface CreateCredentialsInviteAttributes {
  id: string;
  email?: string;
  createdAt?: Date;
  updatedAt?: Date;
  expires_at?: Date;
  created_by: string;
  invite_token: string;
  supervisor_id: string;
}

export type CreateCredentialsInviteWithAssociations = {
  id: string;
  email?: string;
  createdAt: Date;
  updatedAt: Date;
  expires_at?: Date;
  invite_token: string;
  created_by: AdminSupervisor;
  supervisor_info: SupervisorWithAssociations;
};

export type CreateCredentialsInviteCreationAttributes = {
  id?: string;
  email?: string;
  createdAt?: Date;
  updatedAt?: Date;
  expires_at?: Date;
  created_by: string;
  supervisor_id: string;
};

export type UpdateCredentialsInviteCreationAttributes = {
  id?: string;
  email?: string;
  createdAt?: Date;
  updatedAt?: Date;
  expires_at?: Date;
  created_by?: string;
  supervisor_id?: string;
};

class CreateCredentialsInvite
  extends Model<
    InferAttributes<CreateCredentialsInvite, {omit: 'created_by_info' | 'supervisor_info'}>,
    InferCreationAttributes<CreateCredentialsInvite, {omit: 'created_by_info' | 'supervisor_info'}>
  >
  implements CreateCredentialsInviteAttributes
{
  // model attributes

  declare id: CreationOptional<string>;
  declare created_by: ForeignKey<string>;
  declare email: CreationOptional<string>;
  declare expires_at: CreationOptional<Date>;
  declare supervisor_id: ForeignKey<string>;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
  declare invite_token: CreationOptional<string>;

  // model associations
  declare created_by_info?: NonAttribute<Supervisor>;
  declare supervisor_info?: NonAttribute<Supervisor>;
}

// configure model
CreateCredentialsInvite.init(
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
    created_by: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isUUID: 4
      },
      references: {
        model: 'supervisors',
        key: 'id'
      }
    },
    email: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        isEmail: true
      },
      unique: true,
      defaultValue: null
    },
    supervisor_id: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isUUID: 4
      },
      unique: true,
      references: {
        model: 'supervisors',
        key: 'id'
      }
    },
    invite_token: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      defaultValue: () => crypto.randomBytes(16).toString('hex')
    },

    expires_at: {
      type: DataTypes.DATE,
      allowNull: false,
      // expires in 96 hours - 4 days
      defaultValue: new Date(new Date().getTime() + 96 * 60 * 60 * 1000),
      validate: {
        isDate: true
      }
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE
  },
  {
    sequelize,
    modelName: 'create_credentials_invite',
    timestamps: true
  }
);

export default CreateCredentialsInvite;
