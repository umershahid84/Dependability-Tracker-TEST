import { makeDate } from '../../../lib/utils';
import { SupervisorWithAssociations } from '../../../lib/db/models/Supervisor';

export const supervisorListStyles = {
  button: 'hover:underline hover:underline-offset-4',
  h1: 'w-auto text-xl font-semibold whitespace-nowrap',
  li: 'rounded-md employee drop-shadow-md toggle-container w-full',
  modalClasses: 'bg-tertiary p-8 rounded-md shadow-lg relative w-auto ',
  span: 'w-auto flex flex-wrap flex-row gap-4 justify-center items-center',
  listContainer: 'w-full flex flex-col items-center justify-center gap-4 overflow-y-auto mt-6',
  containerClassName:
    'w-full flex flex-wrap flex-row justify-between items-center gap-4 bg-tertiary p-2 rounded-md mt-6 relative',
  div: 'w-full flex flex-col md:flex-row justify-center items-center gap-4  bg-tertiary p-2 rounded-md mt-6'
};
export type SupervisorsSortBy =
  | 'name'
  | 'isAdmin'
  | 'createdAt'
  | 'updatedAt'
  | 'missingCredentials'
  | 'hasCreationInvite'
  | 'needsCredentialsInvite';

export const supervisorsSortOptions = [
  {
    value: 'name',
    text: 'Name'
  },
  {
    value: 'isAdmin',
    text: 'Admin'
  },
  {
    value: 'createdAt',
    text: 'Created At'
  },
  {
    value: 'updatedAt',
    text: 'Updated At'
  },
  {
    value: 'missingCredentials',
    text: 'Missing Credentials'
  },
  {
    value: 'hasCreationInvite',
    text: 'Has Creation Invite'
  },
  {
    value: 'needsCredentialsInvite',
    text: 'Needs Credentials Invite'
  }
];

function sortByIsAdmin(supervisors: SupervisorWithAssociations[]): SupervisorWithAssociations[] {
  let admins: SupervisorWithAssociations[] = [];

  for (const supervisor of supervisors) {
    if (supervisor.is_admin) admins.push(supervisor);
  }

  // sort the admins by name
  admins.sort((a, b) => a.supervisor_info.name.localeCompare(b.supervisor_info.name));

  return [
    ...admins,
    ...supervisors
      .filter(supervisor => !supervisor.is_admin)
      .sort((a, b) => a.supervisor_info.name.localeCompare(b.supervisor_info.name))
  ];
}

function sortByMissingCredentials(
  supervisors: SupervisorWithAssociations[]
): SupervisorWithAssociations[] {
  let supervisorsWithMissingCredentials: SupervisorWithAssociations[] = [];

  for (const supervisor of supervisors) {
    if (!supervisor.login_credentials) {
      supervisorsWithMissingCredentials.push(supervisor);
    }
  }

  return [
    ...supervisorsWithMissingCredentials.toSorted((a, b) =>
      a.supervisor_info.name.localeCompare(b.supervisor_info.name)
    ),
    ...supervisors
      .filter(supervisor => supervisor.login_credentials)
      .toSorted((a, b) => a.supervisor_info.name.localeCompare(b.supervisor_info.name))
  ];
}

function sortByHasCreationInvite(
  supervisors: SupervisorWithAssociations[]
): SupervisorWithAssociations[] {
  let supervisorsWithCreationInvite: SupervisorWithAssociations[] = [];

  for (const supervisor of supervisors) {
    if (supervisor.create_credentials_invite) {
      supervisorsWithCreationInvite.push(supervisor);
    }
  }

  return [
    ...supervisorsWithCreationInvite.toSorted((a, b) =>
      a.supervisor_info.name.localeCompare(b.supervisor_info.name)
    ),
    ...supervisors
      .filter(supervisor => !supervisor.create_credentials_invite)
      .toSorted((a, b) => a.supervisor_info.name.localeCompare(b.supervisor_info.name))
  ];
}

function sortByNeedsCredentialsInvite(
  supervisors: SupervisorWithAssociations[]
): SupervisorWithAssociations[] {
  let supervisorsWithNoCreationInvite: SupervisorWithAssociations[] = [];

  for (const supervisor of supervisors) {
    if (!supervisor.create_credentials_invite && !supervisor.login_credentials) {
      supervisorsWithNoCreationInvite.push(supervisor);
    }
  }

  return [
    ...supervisorsWithNoCreationInvite.toSorted((a, b) =>
      a.supervisor_info.name.localeCompare(b.supervisor_info.name)
    ),
    ...supervisors
      .filter(supervisor => supervisor.create_credentials_invite || supervisor.login_credentials)
      .toSorted((a, b) => a.supervisor_info.name.localeCompare(b.supervisor_info.name))
  ];
}

export function sortSupervisors(
  by: SupervisorsSortBy,
  withSupervisors: SupervisorWithAssociations[]
): SupervisorWithAssociations[] {
  let sorted: SupervisorWithAssociations[] = [];

  switch (by) {
    case 'name':
      sorted = withSupervisors.toSorted((a, b) =>
        a.supervisor_info.name.localeCompare(b.supervisor_info.name)
      );
      break;
    case 'isAdmin':
      sorted = sortByIsAdmin(withSupervisors);
      break;

    case 'createdAt':
      sorted = withSupervisors.toSorted(
        (a, b) => makeDate(a.createdAt).getTime() - makeDate(b.createdAt).getTime()
      );
      break;
    case 'updatedAt':
      sorted = withSupervisors.toSorted(
        (a, b) => makeDate(a.updatedAt).getTime() - makeDate(b.updatedAt).getTime()
      );
      break;
    case 'missingCredentials':
      sorted = sortByMissingCredentials(withSupervisors);
      break;
    case 'hasCreationInvite':
      sorted = sortByHasCreationInvite(withSupervisors);
      break;

    case 'needsCredentialsInvite':
      sorted = sortByNeedsCredentialsInvite(withSupervisors);
      break;
    default:
      sorted = withSupervisors;
      break;
  }

  return sorted;
}
