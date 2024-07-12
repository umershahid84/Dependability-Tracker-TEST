import {trim} from '../../../lib/utils/shared/strings';

const getRoleClass = (role: string) => {
  switch (role) {
    case 'Admin':
      return 'text-[var(--green)]';
    case 'Supervisor':
      return 'text-blue-500';
    case 'Employee':
      return 'text-gray-300';
    default:
      return '';
  }
};

export function EmployeeRoles({roles}: {roles: string[]}) {
  return (
    <>
      {roles.map(role => (
        <span
          key={role}
          className={`p-2 bg-gray-900 rounded-md text-xs ${getRoleClass(trim(role))}`}>
          {trim(role)}
        </span>
      ))}
    </>
  );
}
