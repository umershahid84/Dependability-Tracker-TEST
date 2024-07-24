import {ClientAPI} from '../client-api';
import {useIsMounted} from './isMounted';
import {useEffect, useState} from 'react';
import type {ApiData} from '../lib/apiController';
import type {SupervisorWithAssociations} from '../lib/db/models/Supervisor';
import {ModelWithPagination, PaginationQueryParams} from '../lib/db/controller';
import {SupervisorsSortBy} from '../components/Supervisors/SupervisorList/data';

export type UseGetSupervisors = {
  isLoading: boolean;
  error: string | null;
  supervisors: ModelWithPagination<SupervisorWithAssociations> | null;
  refetch: (queryParams?: PaginationQueryParams<SupervisorsSortBy>) => Promise<void>;
};

export function useGetSupervisors(
  queryParams?: PaginationQueryParams<SupervisorsSortBy>
): UseGetSupervisors {
  const isMounted = useIsMounted();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [supervisors, setSupervisors] =
    useState<ModelWithPagination<SupervisorWithAssociations> | null>(null);

  const fetchSupervisors = async (queryParams?: PaginationQueryParams<SupervisorsSortBy>) => {
    try {
      const data: ApiData<
        ModelWithPagination<SupervisorWithAssociations> | SupervisorWithAssociations[]
      > = await ClientAPI.Supervisors.Read(queryParams);

      const supervisors = Array.isArray(data.data)
        ? {
            data: data.data,
            numRecords: data.data.length,
            offset: queryParams?.offset ? Number(queryParams.offset) : 0,
            limit: queryParams?.limit ? Number(queryParams.limit) : data.data.length
          }
        : data.data;

      setIsLoading(false);
      setSupervisors(
        supervisors ?? {
          data: [],
          limit: 0,
          offset: 0,
          numRecords: 0
        }
      );
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
          await fetchSupervisors(queryParams);
        } catch (error) {
          setError(String(error));
          setIsLoading(false);
        }
      })();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMounted, queryParams]);

  return {isLoading, error, refetch: fetchSupervisors, supervisors};
}
