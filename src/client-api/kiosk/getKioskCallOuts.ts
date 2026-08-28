import {ApiData} from '../../lib/apiController';
import type {KioskCallOut} from '../../pages/api/kiosk/callouts';

export const getKioskCallOuts = async (): Promise<ApiData<KioskCallOut[]>> => {
  try {
    const response = await fetch('/api/kiosk/callouts');
    const data: ApiData<KioskCallOut[]> = await response.json();

    if (!response.ok) {
      throw new Error(data.error);
    }

    return data;
  } catch (error) {
    return {error: String(error)};
  }
};
