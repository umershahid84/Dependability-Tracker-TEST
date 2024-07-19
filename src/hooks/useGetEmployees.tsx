import {
  ModelWithPagination,
  PaginationQueryParams,
  EmployeeWithAssociations
} from '../lib/db/controller';
import {useIsMounted} from './isMounted';
import {useEffect, useState} from 'react';
import {ApiData} from '../lib/apiController';
import {EmployeeSortBy, ToastTypes, makeToast} from '../components';

export type UseGetEmployees = {
  isLoading: boolean;
  error: string | null;
  employees: ModelWithPagination<EmployeeWithAssociations> | null;
  refetch: (queryParams?: PaginationQueryParams<EmployeeSortBy>) => Promise<void>;
};

export function useGetEmployees(
  queryParams?: PaginationQueryParams<EmployeeSortBy>
): UseGetEmployees {
  const isMounted = useIsMounted();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [employees, setEmployees] = useState<ModelWithPagination<EmployeeWithAssociations> | null>(
    null
  );

  const fetchEmployees = async (queryParams?: PaginationQueryParams) => {
    try {
      const response = queryParams
        ? await fetch(`/api/admin/employees?${new URLSearchParams(queryParams)}`)
        : await fetch('/api/admin/employees');

      const data: ApiData<
        ModelWithPagination<EmployeeWithAssociations> | EmployeeWithAssociations[]
      > = await response.json();

      if (!response.ok) {
        throw new Error(data.error);
      }

      const employees = Array.isArray(data.data)
        ? {
            data: data.data,
            numRecords: data.data.length,
            offset: queryParams?.offset ? Number(queryParams.offset) : 0,
            limit: queryParams?.limit ? Number(queryParams.limit) : data.data.length
          }
        : data.data;

      setEmployees(
        employees ?? {
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
          await fetchEmployees(queryParams);
        } catch (error) {
          setError(String(error));
        }
      })();
    }
  }, [isMounted, queryParams]);

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

  return {employees, isLoading, error, refetch: fetchEmployees};
}
