// CRUD controller for the Supervisor Model
import {PaginationQueryParams} from '../';
import {populateEmployeeWithDivisions} from '../Employee/helpers';
import {SupervisorWithAssociations} from '../../models/Supervisor';
import {getCreateCredentialsInviteFromDB} from '../CreateCredentialsInvite';
import {CreateCredentialsInvite, Employee, LoginCredential} from '../../models';
import {CreateCredentialsInviteWithAssociations} from '../..//models/CreateCredentialsInvite';

export type SupervisorOptions = PaginationQueryParams & {
  showCredentials?: boolean;
  showCreateCredentialsInvite?: boolean;
};

/**
 * Generates optional items for the include array in the sequelize query
 * based on the options provided
 * @param supervisorOptions - The supervisorOptions to determine which items to include
 * @returns An array of objects to include in the sequelize query
 */
export const createSupervisorInclude = (
  supervisorOptions: SupervisorOptions
): (
  | {
      model: typeof LoginCredential;
      as: string;
    }
  | {
      model: typeof CreateCredentialsInvite;
      as: string;
    }
)[] => {
  const include = [];
  if (supervisorOptions.showCredentials) {
    include.push({
      model: LoginCredential,
      as: 'login_credentials',
      // passwords are hashed but should not be accessible whe querying the supervisors
      // passwords should only be accessible through the login credential model directly
      attributes: {exclude: ['password']}
    });
  }
  if (supervisorOptions.showCreateCredentialsInvite) {
    include.push({
      model: CreateCredentialsInvite,
      as: 'create_credentials_invite'
    });
  }
  return include;
};

/**
 * Attaches the optional login_credentials and create_credentials_invite to the
 * supervisor object. Uses the supervisorOptions to determine which items to attach
 * @param supervisor - a SupervisorWithAssociations object
 * @param supervisorOptions - parameters to determine which optional items to attach
 * @returns
 */
export const handleOptionalReturnValues = async (
  supervisor: SupervisorWithAssociations,
  supervisorOptions: SupervisorOptions
) => {
  // vanilla SupervisorWithAssociations object
  // does not include login_credentials or create_credentials_invite
  const returnValues: SupervisorWithAssociations = {
    id: supervisor.id,
    is_admin: supervisor.is_admin,
    createdAt: supervisor.createdAt,
    updatedAt: supervisor.updatedAt,
    supervisor_info: await populateEmployeeWithDivisions(supervisor.supervisor_info as Employee)
  };

  if (supervisorOptions.showCreateCredentialsInvite) {
    returnValues.create_credentials_invite = (await getCreateCredentialsInviteFromDB({
      supervisor_id: supervisor.id
    })) as CreateCredentialsInviteWithAssociations;
  }

  if (supervisorOptions.showCredentials) {
    returnValues.login_credentials = supervisor.login_credentials as LoginCredential;
  }

  return returnValues;
};
