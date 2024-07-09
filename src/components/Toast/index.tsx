'use client';
import {useState, useEffect} from 'react';
import {formatter, removeExtraWhiteSpaces} from '../../lib/utils/shared/strings';
import {CloseIcon, WarningIcon, ErrorIcon, SuccessIcon, InfoIcon} from '../Icons';

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
  heading: 'text-xl font-light',

  toastIcon: 'w-6 h-6 mr-2 fill-current',
  message: 'text-gray-300 text-base mt-2',
  timestamp: 'text-gray-400 text-xs mt-2',
  body: `ml-4 flex flex-row items-start justify-start w-[98%] bg-slate-800 
  relative p-2 rounded-r-[5px] border-2 border-slate-900`,
  closeIcon: 'w-7 h-7 absolute top-1 right-1 text-gray-400 hover:text-red-500',
  article: `w-[550px] bg-slate-800 rounded-[8px] shadow-lg flex flex-row 
  items-center justify-end border-2 border-slate-900`,
  textContainer: 'w-[95%] flex flex-col items-start justify-center ml-2 text-gray-300'
};

const toastClassNames = {
  [ToastTypes.Info]: {bg: 'bg-cyan-500', text: 'text-cyan-500'},
  [ToastTypes.Error]: {bg: 'bg-red-500', text: 'text-red-500'},
  [ToastTypes.Warning]: {bg: 'bg-amber-500', text: 'text-amber-500'},
  [ToastTypes.Success]: {bg: 'bg-[var(--green)]', text: 'text-[var(--green)]'}
};

const toastIcons = {
  [ToastTypes.Info]: <InfoIcon className={`w-8 h-8 ${toastClassNames[ToastTypes.Info].text}`} />,
  [ToastTypes.Error]: <ErrorIcon className={`w-8 h-8 ${toastClassNames[ToastTypes.Error].text}`} />,
  [ToastTypes.Warning]: (
    <WarningIcon className={`w-8 ${toastClassNames[ToastTypes.Warning].text}`} />
  ),
  [ToastTypes.Success]: (
    <SuccessIcon className={`w-8 h-8 ${toastClassNames[ToastTypes.Success].text}`} />
  )
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

export default function Toast(props: {
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
      window.dispatchEvent(new CustomEvent('remove-toast', {detail: {id: props.id}}));
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
    console.log('props', props);
    window.dispatchEvent(new CustomEvent('remove-toast', {detail: {id: props.id}}));
  };

  const title: string | undefined = props.title !== '' ? props.title : props.type;

  return isMounted ? (
    <article
      className={removeExtraWhiteSpaces(`${styles.article} ${toastClassNames[props.type].bg}`)}>
      <section className={removeExtraWhiteSpaces(styles.body)}>
        <CloseIcon className={styles.closeIcon} onClick={onClose} />

        {toastIcons[props.type]}

        <div className={styles.textContainer}>
          <h2 className={styles.heading}>
            <strong>{formatter.headingNormalizer(String(title))} !</strong>
          </h2>
          <p className={styles.message}>{props.message}</p>
          <p className={styles.timestamp}>{formatDateTime(new Date())}</p>
        </div>
      </section>
    </article>
  ) : (
    <></>
  );
}
