import { trim } from '../../../lib/utils/shared/strings';

const getRoleClass = (role: string) => {
  switch (role) {
    case 'Admin':
      return 'text-accent';
    case 'Supervisor':
      return 'text-blue-500';
    case 'Employee':
      return 'text-primary';
    default:
      return '';
  }
};

export function EmployeeRoles({ roles }: Readonly<{ roles: string[] }>) {
  return (
    <>
      {roles.map(role => (
        <span
          key={role}
          className={`p-2 bg-secondary rounded-md text-xs ${getRoleClass(trim(role))}`}>
          {trim(role)}
        </span>
      ))}
    </>
  );
}
