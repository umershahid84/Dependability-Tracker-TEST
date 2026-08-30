import {InputContainer} from './InputContainer';

export type DisabledTextInputProps = {
  name?: string;
  label: string;
  value: string;
  className?: string;
};

// A read-only, greyed-out input for values that are auto-filled for display only
// (not part of the submitted form data).
export function DisabledTextInput({
  name,
  label,
  value,
  className
}: Readonly<DisabledTextInputProps>) {
  return (
    <InputContainer label={label} htmlFor={name ?? 'disabledTextInput'}>
      <input
        disabled
        readOnly
        type="text"
        title={label}
        value={value}
        name={name ?? 'disabledTextInput'}
        className={`${className ?? 'border p-2 rounded-md bg-tertiary'} cursor-not-allowed opacity-70`}
      />
    </InputContainer>
  );
}
