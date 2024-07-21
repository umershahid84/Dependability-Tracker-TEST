import {
  ModelWithPagination,
  PaginationQueryParams,
  EmployeeWithAssociations
} from '../../lib/db/controller';
import {ApiData} from '../../lib/apiController';

export const GetEmployees = async (
  queryParams?: PaginationQueryParams
): Promise<ApiData<ModelWithPagination<EmployeeWithAssociations> | EmployeeWithAssociations[]>> => {
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

    return data;
  } catch (error) {
    console.error(error);
    return {error: String(error)};
  }
};
