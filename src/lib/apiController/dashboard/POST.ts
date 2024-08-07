// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { Request, Response } from 'express';
import { logTemplate } from '../../utils/server';
import CallOut from '../../../lib/db/models/Callout';
import type { ApiData } from '../../../lib/apiController';


export default async function getDashboardDataUpdateStatusApiHandler( //NOSONAR
  req: Request,
  res: Response<ApiData<boolean>>
) {
  try {
    const { currentCount } = req.body as { currentCount: string };

    let count = parseInt(currentCount, 10);

    if (isNaN(count)) {
      throw new Error('Invalid count');
    }

    const currentCallOutCount = await CallOut.count();

    if (currentCallOutCount === count) {
      return res.status(200).json({ data: false });
    }

    return res.status(200).json({ data: true });
  } catch (error) {
    const errMessage = '❌ Error in getDashboardDataUpdateStatusApiHandler:' + ' ' + error;
    console.error(logTemplate(errMessage, 'error'));
    return res.status(500).json({ error: String(error) });
  }
}

export { getDashboardDataUpdateStatusApiHandler };
