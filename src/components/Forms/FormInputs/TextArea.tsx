import { InputContainer } from './InputContainer';

export type TextAreaProps = {
  rows?: number;
  name?: string;
  label?: string;
  value: string;
  required?: boolean;
  className?: string;
  onChangeHandler: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
};

export function TextArea({
  rows,
  name,
  value,
  label,
  required,
  className,
  onChangeHandler
}: Readonly<TextAreaProps>) {
  return (
    <InputContainer label={label ?? 'Comments'} htmlFor={name ?? 'comment'}>
      <textarea
        value={value}
        rows={rows ?? 4}
        required={required}
        name={name ?? 'comment'}
        onChange={onChangeHandler}
        title={label ?? 'Comments'}
        className={className ?? 'border rounded-md w-full bg-tertiary'}></textarea>
    </InputContainer>
  );
}
