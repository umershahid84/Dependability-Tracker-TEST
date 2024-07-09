import {
  LoginCredentialsAttributes,
  SupervisorWithAssociations,
  LoginCredentialsWithAssociations,
  LoginCredentialsCreationAttributes
} from '../../models/types';
import {LoginCredential} from '../../models';
import {getSupervisorFromDB} from '../Supervisor';
import {validateSupervisorCanCreateLoginCredential} from './helpers';

// (C)reate

export const createLoginCredentialInDB = async (
  props: LoginCredentialsCreationAttributes
): Promise<LoginCredentialsWithAssociations | null> => {
  await validateSupervisorCanCreateLoginCredential(
    props.supervisor_id,
    props.invite_token as string
  );
  try {
    const loginCredential: LoginCredentialsAttributes = (await LoginCredential.create(props)).get({
      plain: true
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
          )) as SupervisorWithAssociations
        }
      : null;
  } catch (error) {
    throw new Error(`\n❌ Error creating loginCredential: ${String(error)}`);
  }
};

export const loginCredentialModelController = {
  createLoginCredentialInDB
};

export default loginCredentialModelController;
