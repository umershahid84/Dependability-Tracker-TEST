import {ApiData} from '../../lib/apiController';
import type {KioskCallOut} from '../../pages/api/kiosk/callouts';
import type {KioskDivisionSlug} from '../../lib/utils/shared/kioskDivisions';

export const getKioskCallOuts = async (
  division?: KioskDivisionSlug
): Promise<ApiData<KioskCallOut[]>> => {
  try {
    const query = division ? `?division=${encodeURIComponent(division)}` : '';
    const response = await fetch(`/api/kiosk/callouts${query}`);
    const data: ApiData<KioskCallOut[]> = await response.json();

    if (!response.ok) {
      throw new Error(data.error);
    }

    return data;
  } catch (error) {
    return {error: String(error)};
  }
};
