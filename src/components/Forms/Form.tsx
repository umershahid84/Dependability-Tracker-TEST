import React from 'react';
import { trim } from '../../lib/utils/shared/strings';

const styles = {
  form: `flex flex-col justify-center items-center w-full min-w-[450px] max-w-2xl bg-secondary p-4 border-2 border-slate-500
   rounded-md gap-2`
};

export default function Form({
  children,
  className,
  onEnter
}: Readonly<{
  className?: string;
  children: React.ReactNode;
  onEnter?: (event: React.KeyboardEvent<HTMLFormElement>) => void;
}>): JSX.Element {
  return (
    <form /*NOSONAR*/ onKeyDown={onEnter} className={className ?? trim(styles.form)}>
      {children}
    </form>
  );
}
