import type {ApiData} from '../../lib/apiController';
import type {SupervisorWithAssociations} from '../../lib/db/models/Supervisor';
import {ModelWithPagination, PaginationQueryParams} from '../../lib/db/controller';
import {SupervisorsSortBy} from '../../components/Supervisors/SupervisorList/data';

export const GetSupervisors = async (
  queryParams?: PaginationQueryParams<SupervisorsSortBy> & {
    showCredentials?: 'true' | 'false';
    showCreateCredentialsInvite?: 'true' | 'false';
  }
): Promise<
  ApiData<ModelWithPagination<SupervisorWithAssociations> | SupervisorWithAssociations[]>
> => {
  const url = queryParams
    ? `/api/admin/supervisors?${new URLSearchParams(queryParams)}`
    : '/api/admin/supervisors';

  const response = await fetch(url);
  try {
    const data: ApiData<SupervisorWithAssociations[]> = await response.json();
    if (!response.ok) {
      throw new Error(data.error ?? 'Error getting supervisors');
    }
    return data;
  } catch (error) {
    return {error: String(error)};
  }
};
