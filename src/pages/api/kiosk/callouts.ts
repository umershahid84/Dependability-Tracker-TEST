// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import {Request, Response} from 'express';
import {ApiData} from '../../../lib/apiController';
import {getCallOutFromDB, getDivisionFromDB} from '../../../lib/db/controller';
import {CallOutWithAssociations} from '../../../lib/db/models/Callout';
import {getDate, getKioskDivisionBySlug, getTimeNoSeconds} from '../../../lib/utils';
import {logTemplate} from '../../../lib/utils/server';

// Trimmed-down callout shape shown on the kiosk display.
// Only these fields should ever be exposed to this public, unauthenticated route.
export type KioskCallOut = {
  id: string;
  employeeName: string;
  callDate: string;
  shiftDateFrom: string;
  shiftDateTo: string;
  shiftTime: string;
};

// This endpoint is intentionally public (no auth check) so it can be displayed
// on an unattended kiosk screen. It must only ever return the fields in KioskCallOut.
export default async function handler(req: Request, res: Response<ApiData<KioskCallOut[]>>) {
  if (req.method !== 'GET') {
    return res.status(405).json({error: 'Method not allowed'});
  }

  try {
    const {division: divisionSlug} = req.query as {division: string | undefined};

    let divisionId: string | null = null;
    if (divisionSlug) {
      const kioskDivision = getKioskDivisionBySlug(divisionSlug);
      if (!kioskDivision) {
        return res.status(400).json({error: `Unknown division: ${divisionSlug}`});
      }

      const division = await getDivisionFromDB.byName(kioskDivision.name);
      if (!division) {
        // Division isn't seeded in the DB yet - treat as "no callouts" rather than erroring.
        return res.status(200).json({data: []});
      }
      divisionId = division.id;
    }

    const now = new Date();
    const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

    // created_at_range is normalized to whole-day boundaries by the DB helper, so it can
    // only narrow the query down to the last ~2 days. Filter to the exact rolling 24-hour
    // window below once the (much smaller) result set is back.
    const callOuts = (await getCallOutFromDB.all({
      created_at_range: [twentyFourHoursAgo, now]
    })) as CallOutWithAssociations[];

    const kioskCallOuts: KioskCallOut[] = callOuts
      .filter(callOut => {
        const createdAt = new Date(callOut.createdAt).getTime();
        return createdAt >= twentyFourHoursAgo.getTime() && createdAt <= now.getTime();
      })
      .filter(
        callOut =>
          !divisionId || callOut.employee?.divisions?.some(division => division.id === divisionId)
      )
      .map(callOut => ({
        id: callOut.id,
        employeeName: callOut.employee?.name ?? 'Unknown',
        callDate: getDate(callOut.callout_date),
        shiftDateFrom: getDate(callOut.shift_date),
        shiftDateTo: getDate(callOut.shift_date_to ?? callOut.shift_date),
        shiftTime: getTimeNoSeconds(callOut.shift_time)
      }));

    return res.status(200).json({data: kioskCallOuts});
  } catch (error) {
    const errMessage = '❌ Error in kiosk callouts handler:' + ' ' + error;
    console.error(logTemplate(errMessage, 'error'));
    return res.status(500).json({error: String(error)});
  }
}

export const config = {
  api: {
    bodyParser: true,
    externalResolver: true
  }
};
