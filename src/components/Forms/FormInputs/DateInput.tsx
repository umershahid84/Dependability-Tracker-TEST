import {InputContainer} from './InputContainer';
import {dateTo_YYYY_MM_DD} from '../../../lib/utils';

export type DateProps = {
  date: Date | string;
  name?: string;
  label?: string;
  className?: string;
  required?: boolean;
  onChangeHandler: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export function DateInput({name, date, label, className, required = true, onChangeHandler}: Readonly<DateProps>) {
  return (
    <InputContainer label={label ?? 'Call Date'} htmlFor={name ?? 'callDate'}>
      <input
        required={required}
        type="date"
        name={name ?? 'callDate'}
        title={label ?? 'Call Date'}
        onChange={onChangeHandler}
        value={dateTo_YYYY_MM_DD(date)}
        className={className ?? 'border p-2 rounded-md bg-tertiary'}
      />
    </InputContainer>
  );
}
