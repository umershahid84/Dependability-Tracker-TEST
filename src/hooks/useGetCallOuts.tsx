import {useIsMounted} from './isMounted';
import {useEffect, useState} from 'react';
import {ApiData} from '../lib/apiController';
import {ModalAction} from '../components/ Modal';
import {ToastTypes, makeToast} from '../components';
import {CallOutWithAssociations} from '../lib/db/models/Callout';
import {CallOutSortBy} from '../components/CallOuts/CallOutsList/data';
import {GetAllCallOutOptions} from '../lib/db/controller/Callout/helpers';
import {ModelWithPagination, PaginationQueryParams} from '../lib/db/controller';
import {
  dbSearchParams,
  defaultCallOutsQueryParams
} from '../components/CallOuts/CallOutsList/helpers';
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
      queryParams = queryParams ?? {...defaultCallOutsQueryParams};

      let params: PaginationQueryParams<CallOutSortBy> & {callOutSearchOptions?: string} = {
        ...queryParams
      };

      const hasDateAlready =
        searchParams?.shift_date !== undefined ||
        searchParams?.callout_date !== undefined ||
        searchParams?.shift_date_range !== undefined ||
        searchParams?.callout_date_range !== undefined;

      // add the last x days to the search params if a date range has not already been set
      if (showLast && !hasDateAlready) {
        const date = new Date();
        const start = new Date(date.setDate(date.getDate() - showLast));

        const end = new Date();

        searchParams = {
          ...searchParams,
          created_at_range: [start, end]
        } as GetAllCallOutOptions;
      }

      if (searchParams) {
        params = {
          ...params,
          callOutSearchOptions: JSON.stringify(searchParams)
        } as PaginationQueryParams<CallOutSortBy> & {callOutSearchOptions?: string};
      }

      const response = await fetch(`/api/admin/callouts?${new URLSearchParams(params)}`);
      const data: ApiData<ModelWithPagination<CallOutWithAssociations>> = await response.json();
      if (!response.ok) {
        throw new Error(data.error);
      }
      if (searchParams?.division_id) {
        // filter callOuts by division_id

        if (data?.data?.data) {
          data.data.data = data.data?.data.filter(callOut =>
            callOut.employee.divisions.some(division => division.id === searchParams?.division_id)
          );

          // update the numRecords to reflect the filtered data
          data.data.numRecords = data.data.data.length;
        }
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
