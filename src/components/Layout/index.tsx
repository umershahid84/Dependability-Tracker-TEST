import Image from 'next/image';
import {Toaster} from '@/components';
import React, {PropsWithChildren} from 'react';
import logo from '../../assets/images/seatac-dark.png';

const styles = {
  body: ' bg-slate-950 text-gray-200 flex min-h-full flex-col items-center justify-start p-5 ',
  logo: 'w-auto h-auto',
  imgWidth: 350,
  imgHeight: 100
};

export const Layout = ({children}: PropsWithChildren) => {
  return (
    <div className={styles.body}>
      <Toaster />
      <Image
        id="logo"
        alt="SEA-TAC"
        priority
        className={styles.logo}
        width={styles.imgWidth}
        height={styles.imgHeight}
        src={logo}
      />
      {/* Nav Goes Here */}
      {children}
    </div>
  );
};
