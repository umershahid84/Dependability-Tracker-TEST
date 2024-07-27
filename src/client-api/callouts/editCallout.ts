import {ApiData} from '../../lib/apiController';
import {DefaultCallOutFormData} from '../employees';
import {CallOutWithAssociations} from '../../lib/db/models/Callout';

export const EditCallOut = async (
  calloutId: string,
  formData: DefaultCallOutFormData
): Promise<ApiData<CallOutWithAssociations>> => {
  try {
    const data = {
      formData,
      id: calloutId
    };

    const response = await fetch(`/api/admin/callouts/`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });
    const callOutData: ApiData<CallOutWithAssociations> = await response.json();
    if (!response.ok) {
      throw new Error(callOutData?.error ?? 'Failed to Edit Callout');
    }
    return {
      data: callOutData.data,
      message: 'Callout Edited Successfully'
    };
  } catch (error) {
    return {
      error: String(error)
    };
  }
};
