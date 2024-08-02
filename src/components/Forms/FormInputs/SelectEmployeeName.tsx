import { InputContainer } from './InputContainer';
import type { EmployeeWithAssociations } from '../../../lib/db/controller';

export type SelectEmployeeNameProps = {
  name?: string;
  title?: string;
  className?: string;
  employeeName: string;
  useSelectAll?: boolean;
  employees: EmployeeWithAssociations[];
  onChangeHandler: (e: React.ChangeEvent<HTMLSelectElement>) => void;
};

export function SelectEmployeeName({
  name,
  title,
  employees,
  className,
  employeeName,
  useSelectAll,
  onChangeHandler
}: Readonly<SelectEmployeeNameProps>) {
  return (
    <InputContainer label={title ?? 'Employee Name'} htmlFor={name ?? 'employeeName'}>
      <select
        required
        value={employeeName}
        onChange={onChangeHandler}
        name={name ?? 'employeeName'}
        title={title ?? 'Employee Name'}
        className={className ?? 'border p-2 rounded-md bg-tertiary'}>
        <option value="">Select Employee</option>
        {useSelectAll && <option value="all">Any</option>}
        {employees?.map((employee: EmployeeWithAssociations) => (
          <option key={employee.id} value={employee.id}>
            {employee.name}
          </option>
        ))}
      </select>
    </InputContainer>
  );
}
