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

  if (!admin) {
    throw new Error('Admin supervisor not found');
  }

  if (admin.is_admin === false) {
    throw new Error('Supervisor is not an admin');
  }

  const supervisor = await getSupervisorFromDB.byId(props.supervisor_id);

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

  if (!props.default_email) {
    throw new Error('Missing required default_email');
  }

  if (!props.default_password) {
    throw new Error('Missing required default_password');
  }

  if (typeof props.default_email !== 'string') {
    throw new Error('default_email must be a string');
  }

  if (typeof props.default_password !== 'string') {
    throw new Error('default_password must be a string');
  }

  if (props.default_email.length === 0) {
    throw new Error("default_email can't be empty");
  }

  if (props.default_password.length < 8) {
    throw new Error('default_password must be at least 8 characters');
  }

  return [admin, supervisor];
};
