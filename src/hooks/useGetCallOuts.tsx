import {ClientAPI} from '../client-api';
import {useIsMounted} from './isMounted';
import {useEffect, useState} from 'react';
import {ToastTypes, makeToast} from '../components';
import {CallOutWithAssociations} from '../lib/db/models/Callout';
import {CallOutSortBy} from '../components/CallOuts/CallOutsList/data';
import {GetAllCallOutOptions} from '../lib/db/controller/Callout/helpers';
import {ModelWithPagination, PaginationQueryParams} from '../lib/db/controller';
import {CallOutAdvancedSearchContext, useCallOutAdvancedSearchContext} from '../providers';

export type UseGetCallOuts = {
  isLoading: boolean;
  error: string | null;
  callOuts: ModelWithPagination<CallOutWithAssociations> | null;
  refetch: (queryParams?: PaginationQueryParams<CallOutSortBy>) => Promise<void>;
  setCallOuts: React.Dispatch<
    React.SetStateAction<ModelWithPagination<CallOutWithAssociations> | null>
  >;
};

export type UseGetCallOutsProps = {
  showLast?: number | null;
  queryParams?: PaginationQueryParams<CallOutSortBy>;
};

export function useGetCallOuts({showLast, queryParams}: UseGetCallOutsProps): UseGetCallOuts {
  const isMounted = useIsMounted();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [callOuts, setCallOuts] = useState<ModelWithPagination<CallOutWithAssociations> | null>(
    null
  );
  const {executeSearch, searchParams, setExecuteSearch}: CallOutAdvancedSearchContext =
    useCallOutAdvancedSearchContext();

  const fetchCallOuts = async (
    queryParams?: PaginationQueryParams<CallOutSortBy>,
    searchParams?: GetAllCallOutOptions
  ) => {
    try {
      const data = await ClientAPI.CallOuts.Read(queryParams, searchParams, showLast);
      setCallOuts(
        data.data ?? {
          data: [],
          limit: 0,
          offset: 0,
          numRecords: 0
        }
      );

      setIsLoading(false);
      setExecuteSearch(false);
    } catch (error) {
      setError(String(error));
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isMounted && executeSearch) {
      (async () => {
        setIsLoading(true);
        try {
          await fetchCallOuts(queryParams, searchParams);
        } catch (error) {
          setError(String(error));
        }
      })();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMounted, executeSearch]);

  useEffect(() => {
    if (error) {
      makeToast({
        message: error,
        title: 'Error',
        timeOut: 7500,
        type: ToastTypes.Error
      });
    }
  }, [error]);

  return {callOuts, isLoading, error, setCallOuts, refetch: fetchCallOuts};
}
