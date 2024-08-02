import { InputContainer } from './InputContainer';

export type CallTimeProps = {
  time: string;
  name?: string;
  label?: string;
  className?: string;
  onChangeHandler: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export function TimeInput({
  className,
  label,
  name,
  time,
  onChangeHandler
}: Readonly<CallTimeProps>) {
  return (
    <InputContainer label={label ?? 'Call Time'} htmlFor={name ?? 'callTime'}>
      <input
        required
        type="time"
        value={time}
        name={name ?? 'callTime'}
        title={label ?? 'Call Time'}
        className={className ?? 'border p-2 rounded-md bg-tertiary'}
        onChange={onChangeHandler}
      />
    </InputContainer>
  );
}
