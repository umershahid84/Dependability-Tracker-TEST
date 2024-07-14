import {Logo} from '../../components';
import React, {PropsWithChildren} from 'react';

const styles = {
  body: ' bg-slate-950 text-gray-200 print:text-black flex min-h-full flex-col items-center justify-start p-5 ',
  logo: 'w-auto h-auto',
  imgWidth: 350,
  imgHeight: 100
};

export const Layout = ({children}: PropsWithChildren) => {
  return (
    <div className={styles.body}>
      <Logo className={styles.logo} />
      {children}
    </div>
  );
};
