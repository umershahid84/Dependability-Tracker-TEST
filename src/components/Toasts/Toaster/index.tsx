'use client';
import { uuid } from '../../../lib/utils';
import { Toast, ToastTypes } from '../Toast';
import { trim } from '../../../lib/utils/shared/strings';
import { useEffect, useState, useCallback } from 'react';
import { useIsMounted } from '../../../hooks';

export type IToastMessageContextType = {
  id?: string;
  timeOut?: number;
  title: string | null;
  message: string | null;
  type: ToastTypes | null;
};

export type IToasterMessage = {
  [key: string]: IToastMessageContextType;
};

export const makeToast = (props: IToastMessageContextType): void => {
  window.dispatchEvent(new CustomEvent('toast', { detail: props }));
};
const styles = {
  toaster: `absolute top-0 left-1/2 transform -translate-x-1/2 z-50 w-auto flex flex-col
     items-center p-4 gap-6 transition-all duration-300 ease-in-out`
};

// test messages
const testToasts: Record<string, IToastMessageContextType> = {
  // '1': {
  //   id: '1',
  //   title: 'Test Title',
  //   message: 'Test Message',
  //   type: ToastTypes.Info
  // },
  // '2': {
  //   id: '2',
  //   title: 'Test Title',
  //   message: 'Test Message',
  //   type: ToastTypes.Error
  // },
  // '3': {
  //   id: '3',
  //   title: 'Test Title',
  //   message: 'Test Message',
  //   type: ToastTypes.Warning
  // },
  // '4': {
  //   id: '4',
  //   title: 'Test Title',
  //   message: 'Test Message',
  //   type: ToastTypes.Success
  // }
};

export function Toaster(): JSX.Element {
  const isMounted: boolean = useIsMounted();
  const [toasts, setToasts] = useState<Record<string, IToastMessageContextType>>(testToasts);

  const setToaster = useCallback((event: CustomEvent): void => {
    const id = uuid();
    const { detail } = event;
    const { message, title, type } = detail as IToastMessageContextType;
    setToasts(prevToasts => ({ ...prevToasts, [id]: { id, message, title, type } }));
  }, []);

  const handleRemoveToast = useCallback((event: CustomEvent): void => {
    const { detail } = event;
    const { id } = detail as { id: string };
    setToasts(prevToasts => {
      const newToasts = { ...prevToasts };
      delete newToasts[id];
      return newToasts;
    });
  }, []);

  useEffect(() => {
    const eventHandlers = {
      toast: setToaster,
      'remove-toast': handleRemoveToast
    };
    if (isMounted) {
      for (const [key, value] of Object.entries(eventHandlers)) {
        // @ts-ignore
        window.addEventListener(key, value);
      }
    }
    return () => {
      for (const [key, value] of Object.entries(eventHandlers)) {
        // @ts-ignore
        window.removeEventListener(key, value);
      }
    };
    // eslint-disable-next-line
  }, [isMounted]);

  return (
    <section className={trim(styles.toaster)}>
      {Object.values(toasts).map(({ id, title, type, message }, index) => (
        <Toast
          id={id}
          key={id}
          title={title ?? 'Test Title'}
          type={type ?? ToastTypes.Error}
          message={message ?? 'Test Message'}
          removeInMs={5000 + index * 1500}
        />
      ))}
    </section>
  );
}
