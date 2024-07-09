import {PropsWithChildren} from 'react';
import {removeExtraWhiteSpaces} from '../../utils/shared/strings';

const styles = {
  form: `flex flex-col justify-center items-center w-full min-w-[450px] max-w-2xl bg-slate-900 p-4
   rounded-md gap-2`
};

export default function Form({children}: Readonly<PropsWithChildren>): JSX.Element {
  return <form className={removeExtraWhiteSpaces(styles.form)}>{children}</form>;
}
