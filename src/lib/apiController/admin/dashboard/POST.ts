// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import {Request} from 'express';
import type {NextApiResponse} from 'next';
import CallOut from '../../../../lib/db/models/Callout';
import type {ApiData} from '../../../../lib/apiController';

export default async function getAdminDashboardDataUpdateStatusApiHandler( //NOSONAR
  req: Request,
  res: NextApiResponse<ApiData<boolean>>
) {
  try {
    const {currentCount} = req.body as {currentCount: string};

    const count = parseInt(currentCount, 10);

    const currentCallOutCount = await CallOut.count();

    if (currentCallOutCount === count) {
      return res.status(200).json({data: false});
    }

    return res.status(200).json({data: true});
  } catch (error) {
    console.error('Error in getAdminDashboardDataUpdateStatusApiHandler:', error);
    return res.status(500).json({error: String(error)});
  }
}

export {getAdminDashboardDataUpdateStatusApiHandler};
