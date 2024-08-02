import { InputContainer } from './InputContainer';
import type { LeaveTypeAttributes } from '../../../lib/db/models/types';

export type SelectLeaveTypes = {
  name?: string;
  title?: string;
  leaveType: string;
  className?: string;
  useSelectAll?: boolean;
  leaveTypes: LeaveTypeAttributes[];
  onChangeHandler: (e: React.ChangeEvent<HTMLSelectElement>) => void;
};

export function SelectLeaveTypeReason({
  name,
  title,
  leaveType,
  className,
  leaveTypes,
  useSelectAll,
  onChangeHandler
}: Readonly<SelectLeaveTypes>) {
  return (
    <InputContainer label={title ?? 'Leave Type'} htmlFor={name ?? 'leaveType'}>
      <select
        required
        name={name ?? 'leaveType'}
        title={title ?? 'Leave Type'}
        className={className ?? 'border p-2 rounded-md bg-tertiary'}
        value={leaveType}
        onChange={onChangeHandler}>
        <option value="">Select Leave Type</option>
        {useSelectAll && <option value="all">Any</option>}
        {leaveTypes?.map((leaveType: LeaveTypeAttributes) => (
          <option key={leaveType.id} value={leaveType.id}>
            {leaveType.reason}
          </option>
        ))}
      </select>
    </InputContainer>
  );
}
