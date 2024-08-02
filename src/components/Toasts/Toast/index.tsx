'use client';
import { useState, useEffect } from 'react';
import { formatter, trim } from '../../../lib/utils/shared/strings';
import { CloseIcon, WarningIcon, ErrorIcon, SuccessIcon, InfoIcon } from '../../Icons';

export enum ToastTypes {
  Info = 'info',
  Error = 'error',
  Warning = 'warning',
  Success = 'success'
}

export interface IToastProps {
  message: string;
  type: ToastTypes;
  onClose?: () => void;
}

const styles = {
  infoBg: 'bg-cyan-500',
  errorBg: 'bg-red-500',
  warningBg: 'bg-amber-500',
  successBg: 'bg-accent-primary',
  infoText: 'text-cyan-500',
  errorText: 'text-red-500',
  warningText: 'text-amber-500',
  successText: 'text-accent',
  heading: 'text-xl font-light',
  toastIcon: 'w-6 h-6 mr-2 fill-current',
  timestamp: 'text-tertiary print:text-black text-xs mt-2',
  body: `ml-4 flex flex-row items-start justify-start w-[98%] bg-secondary
  relative p-2 rounded-r-[5px]`,
  article: ` w-auto min-w-[350px] rounded-[8px] flex flex-row 
  items-center justify-end`,
  closeIcon: 'w-7 h-7 absolute top-1 right-1 text-tertiary print:text-black hover:text-red-500',
  textContainer:
    'w-[95%] flex flex-col items-start justify-center ml-2 text-primary print:text-black',
  messageContainer:
    'w-full flex flex-col items-start justify-center ml-2 text-primary print:text-black',
  message:
    'text-primary print:text-black text-base mt-2 flex flex-wrap flex-row items-start justify-start'
};

const toastIcons = {
  [ToastTypes.Info]: <InfoIcon className={`w-8 h-8 ${styles.infoText}`} />,
  [ToastTypes.Error]: <ErrorIcon className={`w-8 h-8 ${styles.errorText}`} />,
  [ToastTypes.Warning]: <WarningIcon className={`w-8 ${styles.warningText}`} />,
  [ToastTypes.Success]: <SuccessIcon className={`w-8 h-8 ${styles.successText}`} />
};

const formatDateTime = (date: Date): string => {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    hour12: true
  }).format(new Date(date));
};

export function Toast(props: {
  // NOSONAR
  id?: string;
  title?: string;
  message: string;
  type: ToastTypes;
  removeInMs?: number;
}): JSX.Element {
  const removeInMs: number = props.removeInMs ?? 5000;

  const [isMounted, setIsMounted] = useState<boolean>(false);
  const [timer, setTimer] = useState<NodeJS.Timeout | null>(null);

  const removeToast = (): NodeJS.Timeout => {
    return setTimeout(() => {
      setTimer(null);
      window.dispatchEvent(new CustomEvent('remove-toast', { detail: { id: props.id } }));
    }, removeInMs);
  };

  useEffect(() => {
    !isMounted && setIsMounted(true);
    return () => {
      isMounted && setIsMounted(false);
    };
    //eslint-disable-next-line
  }, []);

  useEffect(() => {
    isMounted && setTimer(removeToast());
    return () => {
      !isMounted && setTimer(null);
    };
    //eslint-disable-next-line
  }, [isMounted]);

  const onClose = (): void => {
    if (timer) {
      clearTimeout(timer);
      setTimer(null);
    }
    window.dispatchEvent(new CustomEvent('remove-toast', { detail: { id: props.id } }));
  };

  const title: string | undefined = props.title !== '' ? props.title : props.type;

  const bg = styles[`${props.type}Bg`];
  const dropShadow = `toast-${props.type}`;

  return isMounted ? (
    <article className={trim(`${styles.article} ${bg} ${dropShadow}`)}>
      <section className={trim(styles.body)}>
        <CloseIcon className={styles.closeIcon} onClick={onClose} />

        {toastIcons[props.type]}

        <div className={styles.textContainer}>
          <h2 className={styles.heading}>
            <strong>{formatter.headingNormalizer(String(title))} !</strong>
          </h2>

          <div className={styles.messageContainer}>
            <p className={styles.message}>{props.message}</p>
          </div>

          <p className={styles.timestamp}>{formatDateTime(new Date())}</p>
        </div>
      </section>
    </article>
  ) : (
    <></>
  );
}
