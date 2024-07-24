import {
  SupervisorWithAssociations,
  CreateCredentialsInviteCreationAttributes
} from '../../models/types';
import {uuidV4Regex} from '../../../utils';
import {LoginCredential} from '../../models';
import {getSupervisorFromDB} from '../Supervisor';

export const validateCreateCredentialsInviteProps = async (
  props: CreateCredentialsInviteCreationAttributes
): Promise<SupervisorWithAssociations[]> => {
  if (!uuidV4Regex.test(props.created_by)) {
    throw new Error('Invalid created_by');
  }

  if (!uuidV4Regex.test(props.supervisor_id)) {
    throw new Error('Invalid supervisor_id');
  }

  const admin = await getSupervisorFromDB.byId(props.created_by);

  // istanbul ignore next
  if (!admin) {
    throw new Error('Admin supervisor not found');
  }

  if (admin.is_admin === false) {
    throw new Error('Supervisor is not an admin');
  }

  const supervisor = await getSupervisorFromDB.byId(props.supervisor_id);

  // istanbul ignore next
  if (!supervisor) {
    throw new Error('Supervisor not found');
  }

  // see if the supervisor already has login credentials
  const existing = await LoginCredential.findOne({
    where: {supervisor_id: props.supervisor_id}
  });

  if (existing) {
    throw new Error(
      'Supervisor already has login credentials.\nIf you need to reset the password, please use the reset password feature'
    );
  }

  return [admin, supervisor];
};
