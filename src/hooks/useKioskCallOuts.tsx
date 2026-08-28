import {useIsMounted} from './isMounted';
import {useEffect, useRef, useState} from 'react';
import type {KioskCallOut} from '../pages/api/kiosk/callouts';
import {getKioskCallOuts} from '../client-api/kiosk/getKioskCallOuts';

const POLL_INTERVAL_MS = 15000;

export type UseKioskCallOuts = {
  callOuts: KioskCallOut[];
  isLoading: boolean;
  error: string | null;
};

export function useKioskCallOuts(): UseKioskCallOuts {
  const isMounted = useIsMounted();
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [callOuts, setCallOuts] = useState<KioskCallOut[]>([]);

  useEffect(() => {
    if (!isMounted) {
      return;
    }

    let cancelled = false;

    const fetchCallOuts = async () => {
      const {data, error} = await getKioskCallOuts();

      if (cancelled) {
        return;
      }

      if (error) {
        setError(error);
      } else {
        setError(null);
        setCallOuts(data ?? []);
      }

      setIsLoading(false);
    };

    fetchCallOuts();
    intervalRef.current = setInterval(fetchCallOuts, POLL_INTERVAL_MS);

    return () => {
      cancelled = true;
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isMounted]);

  return {callOuts, isLoading, error};
}
