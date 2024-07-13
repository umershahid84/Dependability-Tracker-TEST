import {useIsMounted} from './isMounted';
import {useEffect, useState} from 'react';
import {ApiData} from '../pages/api/sign-up';
import {EmployeeWithAssociations} from '../lib/db/controller/Employee';
import {ModelWithPagination, PaginationQueryParams} from '../lib/db/controller/Employee/helpers';
import {EmployeeSortBy, ToastTypes, defaultEmployeesQueryParams, makeToast} from '../components';

export type UseEmployeeData = {
  isLoading: boolean;
  error: string | null;
  employees: ModelWithPagination<EmployeeWithAssociations> | null;
  refetch: (queryParams?: PaginationQueryParams<EmployeeSortBy>) => void;
};

export function useEmployeeData(queryParams?: PaginationQueryParams<EmployeeSortBy>) {
  const isMounted = useIsMounted();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [employees, setEmployees] = useState<ModelWithPagination<EmployeeWithAssociations> | null>(
    null
  );

  const fetchEmployees = async (queryParams?: PaginationQueryParams) => {
    try {
      queryParams = queryParams ?? defaultEmployeesQueryParams;

      const response = await fetch(`/api/admin/employees?${new URLSearchParams(queryParams)}`);
      const data: ApiData<ModelWithPagination<EmployeeWithAssociations>> = await response.json();
      if (!response.ok) {
        throw new Error(data.error);
      }

      setEmployees(
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
