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

export const isPasswordExpired = (passwordChangedAt: Date): boolean => {
  const expiryDays = parseInt(process.env.PASSWORD_EXPIRY_DAYS ?? '90', 10);
  const expiryDate = new Date(passwordChangedAt);
  expiryDate.setDate(expiryDate.getDate() + expiryDays);
  return new Date() > expiryDate;
};
