import type { SupervisorWithAssociations } from '../../../lib/db/models/types';

const styles = {
  statusHeader:
    'text-sm absolute top-1 right-24 sm:right-32 w-auto bg-amber-600 rounded-md py-1 px-2 Text-outline hide-on-print'
};

export function SupervisorStatusHeader(
  supervisor: Readonly<SupervisorWithAssociations>
): React.ReactElement {
  const hasCredentials: boolean = Boolean(supervisor.login_credentials);
  const hasCreateCredentialsInvite: boolean = Boolean(supervisor.create_credentials_invite);
  const needsInvite: boolean = Boolean(!hasCredentials && !hasCreateCredentialsInvite);

  let status: string[] = [];

  if (hasCreateCredentialsInvite) {
    status.push('Missing Credentials');
  }

  if (needsInvite) {
    status.push('Needs Credential Invite');
  }

  if (hasCredentials) {
    status = [];
  }

  const extraClasses = needsInvite ? 'bg-red-600' : 'bg-amber-600';

  return status.length > 0 ? (
    <span className={styles.statusHeader + ' ' + extraClasses}>{status.join(', ')}</span>
  ) : (
    <></>
  );
}
