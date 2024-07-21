import {ClientAPI} from '../client-api';
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

export function useGetSupervisors(): UseGetSupervisors {
  const isMounted = useIsMounted();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [supervisors, setSupervisors] = useState<SupervisorWithAssociations[] | null>(null);

  const fetchSupervisors = async () => {
    try {
      const data: ApiData<SupervisorWithAssociations[]> = await ClientAPI.Supervisors.Read();
      setSupervisors(data?.data ?? []);
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
