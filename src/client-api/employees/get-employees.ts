import {
  ModelWithPagination,
  PaginationQueryParams,
  EmployeeWithAssociations
} from '../../lib/db/controller';
import {ApiData} from '../../lib/apiController';
import {EmployeeSortBy} from '../../components';

export const GetEmployees = async (
  queryParams?: PaginationQueryParams<EmployeeSortBy>
): Promise<ApiData<ModelWithPagination<EmployeeWithAssociations> | EmployeeWithAssociations[]>> => {
  try {
    const url = queryParams
      ? `/api/admin/employees?${new URLSearchParams(queryParams)}`
      : '/api/admin/employees';

    const response = await fetch(url);

    const data: ApiData<
      ModelWithPagination<EmployeeWithAssociations> | EmployeeWithAssociations[]
    > = await response.json();

    if (!response.ok) {
      throw new Error(data.error);
    }

    return data;
  } catch (error) {
    console.error(error);
    return {error: String(error)};
  }
};
