import {InputContainer} from './InputContainer';
import type {LeaveTypeAttributes} from '../../../lib/db/models/types';

export type SelectLeaveTypes = {
  name?: string;
  title?: string;
  leaveType: string;
  className?: string;
  leaveTypes: LeaveTypeAttributes[];
  onChangeHandler: (e: React.ChangeEvent<HTMLSelectElement>) => void;
};

export function SelectLeaveTypeReason({
  name,
  title,
  leaveType,
  className,
  leaveTypes,
  onChangeHandler
}: Readonly<SelectLeaveTypes>) {
  return (
    <InputContainer label={title ?? 'Leave Type'} htmlFor={name ?? 'leaveType'}>
      <select
        required
        name={name ?? 'leaveType'}
        title={title ?? 'Leave Type'}
        className={className ?? 'border p-2 rounded-md bg-slate-800'}
        value={leaveType}
        onChange={onChangeHandler}>
        <option value="">Select Leave Type</option>
        {leaveTypes?.map((leaveType: LeaveTypeAttributes) => (
          <option key={leaveType.id} value={leaveType.id}>
            {leaveType.reason}
          </option>
        ))}
      </select>
    </InputContainer>
  );
}
