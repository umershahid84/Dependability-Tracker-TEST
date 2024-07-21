import React, {useEffect} from 'react';
import {useIsMounted} from '../../hooks';
import {NextRouter, useRouter} from 'next/router';
import {ClientAPI, Logout} from '../../client-api';

import {trim} from '../../lib/utils/shared/strings';

const styles = {
  logout: `absolute top-28 sm:top-2 right-2 p-3 rounded-md tracking-wide text-xl
           hover:bg-[var(--green)] Text-outline bg-slate-700`
};

export const LogoutButton = ({className}: {className?: string}) => {
  const router: NextRouter = useRouter();
  const isMounted: boolean = useIsMounted();

  const handleMetaShiftL = (event: KeyboardEvent) => {
    if ((event.key === 'l' || event.key === 'L') && event.metaKey && event.shiftKey) {
      Logout(router);
    }
  };
  useEffect(() => {
    isMounted && window.addEventListener('keydown', handleMetaShiftL);

    return () => {
      window.removeEventListener('keydown', handleMetaShiftL);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMounted]);

  return (
    <button
      type="button"
      onClick={async () => await ClientAPI.Supervisors.Logout(router)}
      className={`${className ?? trim(styles.logout)} hide-on-print`}>
      Logout
    </button>
  );
};
