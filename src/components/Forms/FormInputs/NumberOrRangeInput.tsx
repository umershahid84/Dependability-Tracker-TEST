export type NumberOrRangeInputProps = {
  min?: string;
  max?: string;
  step?: string;
  name?: string;
  title?: string;
  label?: string;
  amount: number;
  className?: string;
  placeholder?: string;
  type?: 'number' | 'range';
  onChangeHandler: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export function NumberOrRangeInput({
  min,
  max,
  step,
  type,
  name,
  label,
  amount,
  className,
  placeholder,
  onChangeHandler
}: Readonly<NumberOrRangeInputProps>) {
  return (
    <input
      value={amount}
      min={min ?? '0'}
      max={max ?? '600'}
      step={step ?? '1'}
      type={type ?? 'number'}
      onChange={onChangeHandler}
      name={name ?? 'lateArrivalMinutes'}
      placeholder={placeholder ?? 'Minutes'}
      title={label ?? 'Arrived Late (Mins)'}
      className={className ?? 'border p-[5.5px] rounded-md w-full bg-tertiary'}
    />
  );
}
