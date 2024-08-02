'use client';
import { useEffect, useState } from 'react';

export type FormInputWithErrorsProps = {
  id: string;
  gap?: string;
  type: string;
  label: string;
  value: string;
  errors?: string[];
  className?: string;
  required?: boolean;
  placeholder?: string;
  autoComplete?: string;
  onBlur?: (event: Event) => void;
  onFocus?: (event: Event) => void;
  setValidated?: React.Dispatch<React.SetStateAction<boolean>>;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

const defaultStyles = {
  label: 'place-self-start mb-1',
  required: 'text-red-600 text-bold',
  error: 'text-red-600 text-sm text-bold mb-1 ',
  span: 'flex flex-row justify-between items-center w-full',
  div: 'w-full flex flex-col justify-center items-center p-2',
  input:
    'w-full p-2 rounded-md bg-tertiary ring-1 ring-gray-300 focus:ring-2 focus:outline-none focus:ring-blue-500'
};

export default function FormInputWithErrors(
  props: Readonly<FormInputWithErrorsProps>
): React.JSX.Element {
  const [hasError, setHasError] = useState<boolean>(false);
  const [styles, setStyles] = useState<typeof defaultStyles>(defaultStyles);

  useEffect(() => {
    props.value.length > 0 && setHasError((props?.errors?.length ?? 0) > 0);
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    props.value.length > 0 && setHasError((props?.errors?.length ?? 0) > 0);
    // eslint-disable-next-line
  }, [props.errors]);

  useEffect(() => {
    hasError &&
      setStyles({
        ...styles,
        input:
          'w-full p-2 rounded-md bg-tertiary ring-1 ring-gray-300 focus:ring-2 focus:outline-none focus:ring-red-500'
      });

    !hasError && setStyles({ ...styles, input: defaultStyles.input });
    // eslint-disable-next-line
  }, [hasError]);
  return (
    <div className={styles.div}>
      <span className={styles.span}>
        <label className={styles.label} htmlFor={props.id}>
          {props.required && <span className={styles.required}>*</span>} {props.label}
        </label>
        <span>
          {props.errors?.map((error, i) => (
            <p className={styles.error} key={`${props.label}-${i}`}>
              {error}
            </p>
          ))}
        </span>
      </span>
      {/* @ts-ignore */}
      <input
        {...props}
        tabIndex={0}
        className={(props?.className ?? styles.input) + ' ' + props.gap ?? ''}
      />
    </div>
  );
}
