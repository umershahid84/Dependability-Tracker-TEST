import {useIsMounted} from './isMounted';
import {useEffect, useState} from 'react';
import {ApiData} from '../lib/apiController';
import {ToastTypes, makeToast} from '../components';
import {CallOutWithAssociations} from '../lib/db/models/Callout';
import {CallOutSortBy} from '../components/CallOuts/CallOutsList/data';
import {GetAllCallOutOptions} from '../lib/db/controller/Callout/helpers';
import {ModelWithPagination, PaginationQueryParams} from '../lib/db/controller';
import {defaultCallOutsQueryParams} from '../components/CallOuts/CallOutsList/helpers';

export type UseCallOutsData = {
  isLoading: boolean;
  error: string | null;
  callOuts: ModelWithPagination<CallOutWithAssociations> | null;
  refetch: (queryParams?: PaginationQueryParams<CallOutSortBy>) => Promise<void>;
  setCallOuts: React.Dispatch<
    React.SetStateAction<ModelWithPagination<CallOutWithAssociations> | null>
  >;
};

export function useCallOutsData(
  queryParams?: PaginationQueryParams<CallOutSortBy>,
  dbSearchParams?: GetAllCallOutOptions,
  showLast?: number | null
): UseCallOutsData {
  const isMounted = useIsMounted();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [callOuts, setCallOuts] = useState<ModelWithPagination<CallOutWithAssociations> | null>(
    null
  );

  const fetchCallOuts = async (
    queryParams?: PaginationQueryParams<CallOutSortBy>,
    dbSearchParams?: GetAllCallOutOptions
  ) => {
    try {
      queryParams = queryParams ?? {...defaultCallOutsQueryParams};

      let params: PaginationQueryParams<CallOutSortBy> & {callOutSearchOptions?: string} = {
        ...queryParams
      };

      const hasDateAlready =
        dbSearchParams?.shift_date !== undefined ||
        dbSearchParams?.callout_date !== undefined ||
        dbSearchParams?.shift_date_range !== undefined ||
        dbSearchParams?.callout_date_range !== undefined;

      // add the last x days to the search params if a date range has not already been set
      if (showLast && !hasDateAlready) {
        const date = new Date();
        const start = new Date(date.setDate(date.getDate() - showLast));

        const end = new Date();

        dbSearchParams = {
          ...dbSearchParams,
          created_at_range: [start, end]
        } as GetAllCallOutOptions;
      }

      if (dbSearchParams) {
        params = {
          ...params,
          callOutSearchOptions: JSON.stringify(dbSearchParams)
        } as PaginationQueryParams<CallOutSortBy> & {callOutSearchOptions?: string};
      }

      const response = await fetch(`/api/admin/callouts?${new URLSearchParams(params)}`);
      const data: ApiData<ModelWithPagination<CallOutWithAssociations>> = await response.json();
      if (!response.ok) {
        throw new Error(data.error);
      }

      setCallOuts(
        data.data ?? {
          data: [],
          limit: 0,
          offset: 0,
          numRecords: 0
        }
      );

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
          await fetchCallOuts(queryParams, dbSearchParams);
        } catch (error) {
          setError(String(error));
        }
      })();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMounted, queryParams, dbSearchParams, showLast]);

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
