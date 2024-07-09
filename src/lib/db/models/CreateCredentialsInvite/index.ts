import {
  Model,
  DataTypes,
  ForeignKey,
  NonAttribute,
  InferAttributes,
  CreationOptional,
  InferCreationAttributes
} from 'sequelize';
import bcrypt from 'bcrypt';
import sequelize from '../../connection';
import {hashPassword} from '../LoginCredential';
import {uuid} from '../../../utils/shared/uuid';
import Supervisor, {AdminSupervisor, SupervisorWithAssociations} from '../Supervisor';

export interface CreateCredentialsInviteAttributes {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  expires_at?: Date;
  created_by: string;
  supervisor_id: string;
  default_email: string;
  default_password: string;
}

export type CreateCredentialsInviteWithAssociations = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  expires_at?: Date;
  default_email: string;
  default_password: string;
  created_by: AdminSupervisor;
  supervisor_info: SupervisorWithAssociations;
  comparePassword: (password: string) => boolean;
};

export type CreateCredentialsInviteCreationAttributes = {
  id?: string;
  createdAt?: Date;
  updatedAt?: Date;
  expires_at?: Date;
  created_by: string;
  supervisor_id: string;
  default_email: string;
  default_password: string;
};

class CreateCredentialsInvite
  extends Model<
    InferAttributes<CreateCredentialsInvite, {omit: 'created_by_info' | 'supervisor_info'}>,
    InferCreationAttributes<CreateCredentialsInvite, {omit: 'created_by_info' | 'supervisor_info'}>
  >
  implements CreateCredentialsInviteAttributes
{
  // model attributes

  declare default_email: string;
  declare default_password: string;
  declare id: CreationOptional<string>;
  declare created_by: ForeignKey<string>;
  declare expires_at: CreationOptional<Date>;
  declare supervisor_id: ForeignKey<string>;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;

  // model associations
  declare created_by_info?: NonAttribute<Supervisor>;
  declare supervisor_info?: NonAttribute<Supervisor>;

  // model class methods
  comparePassword(password: string): NonAttribute<boolean> {
    // istanbul ignore next
    return bcrypt.compareSync(password, this.default_password);
  }
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
    default_email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true
      }
    },
    default_password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    expires_at: {
      type: DataTypes.DATE,
      allowNull: false,
      // expires in 24 hours
      defaultValue: new Date(new Date().getTime() + 24 * 60 * 60 * 1000),
      validate: {
        isDate: true
      }
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE
  },
  {
    // hash password before creating and updating
    hooks: {
      async beforeCreate(loginCredential): Promise<void> {
        loginCredential.default_password = await hashPassword(loginCredential.default_password);
      },
      // istanbul ignore next
      async beforeUpdate(loginCredential): Promise<void> {
        loginCredential.default_password = await hashPassword(loginCredential.default_password);
      }
    },
    sequelize,
    modelName: 'create_credentials_invite',
    timestamps: true
  }
);

export default CreateCredentialsInvite;
