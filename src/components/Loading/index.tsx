'use client';
import {JSX, useEffect, useState} from 'react';
import Spinner, {SpinnerStyles} from '../Spinner';

const THREE_SECONDS = 3000;

export type LoadingProps = {
  label?: string;
};

export default function Loading(props: Readonly<LoadingProps>): JSX.Element {
  const [spinnerColor, setSpinnerColor] = useState<string>(SpinnerStyles.greenText);

  const threeSecTimeout = (): NodeJS.Timeout =>
    setTimeout(() => {
      setSpinnerColor(SpinnerStyles.yellowText);
      sixSecTimeout();
    }, THREE_SECONDS);

  const sixSecTimeout = (): NodeJS.Timeout =>
    setTimeout(() => {
      setSpinnerColor(SpinnerStyles.orangeText);
      nineSecTimeout();
    }, THREE_SECONDS);

  const nineSecTimeout = (): NodeJS.Timeout =>
    setTimeout(() => {
      setSpinnerColor(SpinnerStyles.redText);
    }, THREE_SECONDS);

  const updateLoader = (): NodeJS.Timeout => threeSecTimeout();

  const clearTimeouts = (): void => {
    clearTimeout(threeSecTimeout());
    clearTimeout(sixSecTimeout());
    clearTimeout(nineSecTimeout());
  };

  useEffect(() => {
    updateLoader();
    return () => clearTimeouts();
    // eslint-disable-next-line
  }, []);

  return <Spinner textColor={spinnerColor} label={props.label} />;
}
