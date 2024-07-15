import {useIsMounted} from './isMounted';
import {useEffect, useState} from 'react';
import {getDivisions} from '../client-api';
import {DivisionAttributes} from '../lib/db/models/Division';

export type UseDivisions = {
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
  divisions: DivisionAttributes[] | null;
};

export function useDivisions(): UseDivisions {
  const isMounted = useIsMounted();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [divisions, setDivisions] = useState<DivisionAttributes[] | null>(null);

  const fetchDivisions = async () => {
    try {
      const _divisions: DivisionAttributes[] = await getDivisions();

      setDivisions(_divisions ?? []);
      setIsLoading(false);
    } catch (error) {
      setError(String(error));
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isMounted) {
      (async () => {
        setIsLoading(true);
        try {
          await fetchDivisions();
        } catch (error) {
          setError(String(error));
        }
      })();
    }
  }, [isMounted]);

  return {isLoading, error, refetch: fetchDivisions, divisions};
}
