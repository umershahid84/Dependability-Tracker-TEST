import {
  SupervisorWithAssociations,
  LoginCredentialsWithAssociations,
  LoginCredentialsCreationAttributes
} from '../../models/types';
import {getSupervisorFromDB} from '../Supervisor';
import {validateSupervisorCanCreateLoginCredential} from './helpers';
import {CreateCredentialsInvite, LoginCredential} from '../../models';

// (C)reate

export const createLoginCredentialInDB = async (
  props: LoginCredentialsCreationAttributes
): Promise<LoginCredentialsWithAssociations | null> => {
  await validateSupervisorCanCreateLoginCredential(
    props.supervisor_id,
    props.invite_token as string
  );
  try {
    const loginCredential: LoginCredential = await LoginCredential.create(props);

    await CreateCredentialsInvite.destroy({
      where: {
        invite_token: props.invite_token
      }
    });
    return loginCredential
      ? {
          id: loginCredential.id,
          email: loginCredential.email,
          createdAt: loginCredential.createdAt,
          updatedAt: loginCredential.updatedAt,
          password: loginCredential.password,
          supervisor_info: (await getSupervisorFromDB.byId(
            loginCredential.supervisor_id
          )) as SupervisorWithAssociations,
          comparePassword: loginCredential.comparePassword
        }
      : null;
  } catch (error) {
    throw new Error(`\n❌ Error creating loginCredential: ${String(error)}`);
  }
};

// (R)ead
export const getLoginCredentialFromDB = {
  byId: async (id: string): Promise<LoginCredentialsWithAssociations | null> => {
    try {
      const loginCredential: LoginCredential | null = await LoginCredential.findByPk(id);
      return loginCredential
        ? {
            id: loginCredential.id,
            email: loginCredential.email,
            createdAt: loginCredential.createdAt,
            updatedAt: loginCredential.updatedAt,
            password: loginCredential.password,
            supervisor_info: (await getSupervisorFromDB.byId(
              loginCredential.supervisor_id
            )) as SupervisorWithAssociations,
            comparePassword: loginCredential.comparePassword
          }
        : null;
    } catch (error) {
      throw new Error(`\n❌ Error getting loginCredential by id: ${String(error)}`);
    }
  },
  byEmail: async (email: string): Promise<LoginCredentialsWithAssociations | null> => {
    try {
      const loginCredential: LoginCredential | null = await LoginCredential.findOne({
        where: {email}
      });
      return loginCredential
        ? {
            id: loginCredential.id,
            email: loginCredential.email,
            createdAt: loginCredential.createdAt,
            updatedAt: loginCredential.updatedAt,
            password: loginCredential.password,
            supervisor_info: (await getSupervisorFromDB.byId(
              loginCredential.supervisor_id
            )) as SupervisorWithAssociations,
            comparePassword: loginCredential.comparePassword
          }
        : null;
    } catch (error) {
      throw new Error(`\n❌ Error getting loginCredential by email: ${String(error)}`);
    }
  },
  bySupervisorId: async (
    supervisor_id: string
  ): Promise<LoginCredentialsWithAssociations | null> => {
    try {
      const loginCredential: LoginCredential | null = await LoginCredential.findOne({
        where: {supervisor_id}
      });
      return loginCredential
        ? {
            id: loginCredential.id,
            email: loginCredential.email,
            createdAt: loginCredential.createdAt,
            updatedAt: loginCredential.updatedAt,
            password: loginCredential.password,
            supervisor_info: (await getSupervisorFromDB.byId(
              loginCredential.supervisor_id
            )) as SupervisorWithAssociations,
            comparePassword: loginCredential.comparePassword
          }
        : null;
    } catch (error) {
      throw new Error(`\n❌ Error getting loginCredential by supervisor_id: ${String(error)}`);
    }
  }
};

// (D)elete

export const deleteLoginCredentialFromDB = async (id: string) => {
  try {
    const deleted = await LoginCredential.destroy({
      where: {
        id
      }
    });

    return deleted;
  } catch (error) {
    throw new Error(`\n❌ Error deleting loginCredential: ${String(error)}`);
  }
};

export const loginCredentialModelController = {
  createLoginCredentialInDB,
  getLoginCredentialFromDB,
  deleteLoginCredentialFromDB
};

export default loginCredentialModelController;
