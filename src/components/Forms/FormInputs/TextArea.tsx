import { InputContainer } from './InputContainer';
import {SUPERVISOR_COMMENTS_MAX_LENGTH} from '../../../lib/utils/shared/validators';

export type TextAreaProps = {
  rows?: number;
  name?: string;
  label?: string;
  value: string;
  required?: boolean;
  className?: string;
  maxLength?: number;
  onChangeHandler: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
};

export function TextArea({
  rows,
  name,
  value,
  label,
  required,
  className,
  maxLength = SUPERVISOR_COMMENTS_MAX_LENGTH,
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
        maxLength={maxLength}
        className={className ?? 'border rounded-md w-full bg-tertiary'}></textarea>
    </InputContainer>
  );
}
