import { Op } from 'sequelize';
import { CallOut } from '../../../../db';
import { Request, Response } from 'express';
import type { ApiData } from '../../../../../lib/apiController';
import type { CallOutWithAssociations } from '../../../../../lib/db/models/types';
import { populateCallOutAssociations } from '../../../../db/controller/Callout/helpers';
import { logTemplate } from '../../../../utils/server';

export default async function getAdminDashboardDataUpdateApiHandler(
  req: Request,
  res: Response<ApiData<CallOutWithAssociations[]>>
) {
  const { calloutDate } = req.query as { calloutDate: string };
  const latestDate = new Date(calloutDate);
  //add 1 second to the latest date to avoid fetching the same data
  latestDate.setSeconds(latestDate.getMinutes() + 15);

  try {
    const data = (
      await CallOut.findAll({
        where: {
          createdAt: {
            [Op.gt]: latestDate.toISOString()
          }
        }
      })
    )
      .map(callout => callout.get({ plain: true }))
      .map(callout => populateCallOutAssociations(callout));

    const filteredData = (await Promise.all(data)).filter(
      callout => callout !== null
    ) as CallOutWithAssociations[];

    if (!data) {
      throw new Error('Error fetching data');
    }

    return res.status(200).json({ data: filteredData });
  } catch (error) {
    const errMessage = '❌ Error in getAdminDashboardDataUpdateApiHandler:' + ' ' + error;
    console.error(logTemplate(errMessage, 'error'));
    return res.status(500).json({ error: String(error) });
  }
}

export { getAdminDashboardDataUpdateApiHandler };
