import {ApiData} from '../../lib/apiController';
import {CallOutAttributes} from '../../lib/db/models/Callout';

export const DeleteCallOut = async (
  calloutId: string
): Promise<ApiData<CallOutAttributes['id']>> => {
  try {
    const data = {
      id: calloutId
    };

    const response = await fetch(`/api/admin/callouts/`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });
    const callOutData: ApiData<CallOutAttributes['id']> = await response.json();
    if (!response.ok) {
      throw new Error(callOutData?.error ?? 'Failed to Delete Callout');
    }
    return {
      data: callOutData.data,
      message: 'Callout Deleted Successfully'
    };
  } catch (error) {
    return {
      error: String(error)
    };
  }
};
