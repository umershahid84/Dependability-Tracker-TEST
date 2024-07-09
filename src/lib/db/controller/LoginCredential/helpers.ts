import {CreateCredentialsInviteWithAssociations} from '../../models/types';
import {getCreateCredentialsInviteFromDB} from '../CreateCredentialsInvite';

export const validateSupervisorCanCreateLoginCredential = async (
  supervisor_id: string,
  default_email: string,
  default_password: string
): Promise<boolean> => {
  const credentialInvite: CreateCredentialsInviteWithAssociations | null =
    await getCreateCredentialsInviteFromDB({supervisor_id});

  if (!credentialInvite) {
    throw new Error(
      `\n❌ Supervisor ${supervisor_id} does not have permission to create login credentials`
    );
  }

  if (credentialInvite.default_email !== default_email) {
    throw new Error(
      `\n❌ Supervisor ${supervisor_id} does not have permission to create login credentials`
    );
  }

  if (!credentialInvite.comparePassword(default_password)) {
    throw new Error(
      `\n❌ Supervisor ${supervisor_id} does not have permission to create login credentials`
    );
  }

  return true;
};
