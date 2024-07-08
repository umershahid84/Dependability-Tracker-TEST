import {CreateCredentialsInviteWithAssociations} from '@/db/models/CreateCredentialsInvite';
import {getCreateCredentialsInviteFromDB} from '../CreateCredentialsInvite';

export const validateSupervisorCanCreateLoginCredential = async (
  supervisor_id: string
): Promise<boolean> => {
  const credentialInvite: CreateCredentialsInviteWithAssociations | null =
    await getCreateCredentialsInviteFromDB({supervisor_id});

  if (!credentialInvite) {
    throw new Error(
      `\n❌ Supervisor ${supervisor_id} does not have permission to create login credentials`
    );
  }
  return true;
};
