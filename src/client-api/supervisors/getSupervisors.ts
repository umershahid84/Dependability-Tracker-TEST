import type {ApiData} from '../../lib/apiController';
import type {SupervisorWithAssociations} from '../../lib/db/models/Supervisor';

export const GetSupervisors = async (): Promise<ApiData<SupervisorWithAssociations[]>> => {
  const response = await fetch('/api/admin/supervisors');
  try {
    const data: ApiData<SupervisorWithAssociations[]> = await response.json();
    if (!response.ok) {
      throw new Error(data.error ?? 'Error getting supervisors');
    }
    return {data: data?.data ?? []};
  } catch (error) {
    return {error: String(error)};
  }
};
