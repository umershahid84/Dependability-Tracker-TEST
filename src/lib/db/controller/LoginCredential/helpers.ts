import {CreateCredentialsInviteWithAssociations} from '../../models/types';
import {getCreateCredentialsInviteFromDB} from '../CreateCredentialsInvite';

export const validateSupervisorCanCreateLoginCredential = async (
  supervisor_id: string,
  invite_token: string
): Promise<boolean> => {
  const credentialInvite: CreateCredentialsInviteWithAssociations | null =
    await getCreateCredentialsInviteFromDB({supervisor_id});

  if (!credentialInvite) {
    throw new Error(
      `\n❌ Supervisor ${supervisor_id} does not have permission to create login credentials`
    );
  }

  if ((credentialInvite?.expires_at ?? 0) < new Date()) {
    throw new Error(
      `\n❌ Supervisor ${supervisor_id} does not have permission to create login credentials`
    );
  }

  if (credentialInvite.invite_token !== invite_token) {
    throw new Error(
      `\n❌ Supervisor ${supervisor_id} does not have permission to create login credentials`
    );
  }

  return true;
};
