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
          is_default: loginCredential.is_default,
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
            is_default: loginCredential.is_default,
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
            is_default: loginCredential.is_default,
            supervisor_info: (await getSupervisorFromDB.byId(
              loginCredential.supervisor_id
            )) as SupervisorWithAssociations,
            comparePassword: loginCredential.comparePassword
          }
        : null;
    } catch (error) {
      throw new Error(`\n❌ Error getting loginCredential by email: ${String(error)}`);
    }
  }
};

export const loginCredentialModelController = {
  createLoginCredentialInDB,
  getLoginCredentialFromDB
};

export default loginCredentialModelController;
