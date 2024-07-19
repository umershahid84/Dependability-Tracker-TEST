import {useIsMounted} from './isMounted';
import {useEffect, useState} from 'react';
import type {ApiData} from '../lib/apiController';
import type {SupervisorWithAssociations} from '../lib/db/models/Supervisor';

export type UseGetSupervisors = {
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  supervisors: SupervisorWithAssociations[] | null;
};

const getSupervisors = async (): Promise<SupervisorWithAssociations[]> => {
  const response = await fetch('/api/admin/supervisors');

  const data: ApiData<SupervisorWithAssociations[]> = await response.json();
  if (!response.ok) {
    console.error('ERROR GETTING SUPERVISORS for useGetSupervisors Hook:\n', data.error);
  }
  return data?.data ?? [];
};

export function useGetSupervisors(): UseGetSupervisors {
  const isMounted = useIsMounted();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [supervisors, setSupervisors] = useState<SupervisorWithAssociations[] | null>(null);

  const fetchSupervisors = async () => {
    try {
      const data: SupervisorWithAssociations[] = await getSupervisors();
      setSupervisors(data ?? []);
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
          await fetchSupervisors();
        } catch (error) {
          setError(String(error));
        }
      })();
    }
  }, [isMounted]);

  return {isLoading, error, refetch: fetchSupervisors, supervisors};
}
