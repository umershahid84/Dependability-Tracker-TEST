import { FormLabel } from './FormLabel';
import { FormLabelContainer } from '../EmployeeModal/FormLayout';
import type { DivisionAttributes } from '../../../lib/db/models/types';

export type SelectDivisionProps = {
  value: string;
  name?: string;
  title?: string;
  className?: string;
  showAny?: boolean;
  divisions: DivisionAttributes[];
  onChangeHandler: (e: React.ChangeEvent<HTMLSelectElement>) => void;
};

export function SelectDivision({
  name,
  title,
  value,
  divisions,
  className,
  showAny = true,
  onChangeHandler
}: Readonly<SelectDivisionProps>) {
  return (
    <FormLabelContainer>
      <FormLabel label={title ?? 'Divisions'} htmlFor={name ?? 'division_id'} />
      <select
        value={value ?? ''}
        onChange={onChangeHandler}
        name={name ?? 'division_id'}
        title={title ?? 'Division(s)'}
        className={className ?? 'border p-2 rounded-md w-full bg-tertiary text-primary'}>
        <option value="">Select Division</option>
        {showAny && <option value="">Any</option>}
        {divisions?.map((division: DivisionAttributes) => (
          <option key={division.id} value={division.id}>
            {division.name}
          </option>
        ))}
      </select>
    </FormLabelContainer>
  );
}
