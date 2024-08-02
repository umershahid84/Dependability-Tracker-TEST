'use client';
import Loading from '../Loading';
import { useEffect, useState } from 'react';
import { trim } from '../../lib/utils/shared/strings';

export type FormActionProps = {
  label?: string;
  isValid: boolean;
  hasError?: boolean;
  onAction?: (event: React.SyntheticEvent) => void;
};

const defaultStyles = {
  div: 'w-full flex flex-col justify-center items-center mt-4',
  defaultButton: trim(`min-w-36 max-w-42 h-auto p-4 bg-tertiary text-lg rounded-md border
                  hover:bg-accent-primary focus:bg-accent-primary hover:text-primary`),
  disabled: 'min-w-36 max-w-42 p-4 bg-tertiary border border-quaternary text-lg rounded-md cursor-not-allowed'
};

export default function FormAction(props: Readonly<FormActionProps>): React.JSX.Element {
  const [styles, setStyles] = useState(defaultStyles);
  const [isValid, setIsValid] = useState<boolean>(false);
  const [isClicked, setIsClicked] = useState<boolean>(false);

  useEffect(() => {
    setIsValid(props.isValid && !isClicked);
  }, [props.isValid, isClicked]);

  useEffect(() => {
    !isValid &&
      styles.defaultButton !== defaultStyles.disabled &&
      setStyles({
        ...styles,
        defaultButton: defaultStyles.disabled
      });

    isValid &&
      styles.defaultButton !== defaultStyles.defaultButton &&
      setStyles({
        ...styles,
        defaultButton: defaultStyles.defaultButton
      });
    // eslint-disable-next-line
  }, [isValid]);

  const actionWrapper = (event: React.SyntheticEvent): void => {
    if (props.onAction) {
      setIsClicked(true);
      props.onAction(event);
    }
  };

  useEffect(() => {
    if (props.hasError) {
      setIsClicked(false);
    }
  }, [props.hasError]);

  return (
    <div className={styles.div}>
      <button
        type="button"
        // @ts-ignore
        onClick={actionWrapper}
        disabled={!props.isValid}
        className={styles.defaultButton}>
        {isClicked && isValid ? <Loading label="Processing..." /> : props.label ?? 'Submit'}
      </button>
    </div>
  );
}
