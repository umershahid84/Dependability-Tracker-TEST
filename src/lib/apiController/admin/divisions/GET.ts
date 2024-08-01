import type { ApiData } from '../../index';
import { Request, Response } from 'express';
import { getDivisionFromDB } from '../../../db/controller';
import { DivisionAttributes } from '../../../db/models/types';
import { getJwtTokenForAPI, JwtPayload } from '../../../../auth';
import { logTemplate } from '../../../utils/server';

export default async function getDivisionsApiHandler(
  req: Request,
  res: Response<ApiData<DivisionAttributes[]>>
) {
  const token: JwtPayload | undefined = await getJwtTokenForAPI(req, res);

  if (!token || !token.isAdmin) {
    return res.status(401).json({ error: 'Unauthorized request' });
  }

  try {
    const divisions = await getDivisionFromDB.all();

    return res.status(200).json({ data: divisions });
  } catch (error) {
    const errMessage = '❌ Error in getDivisionsApiHandler:' + ' ' + error;
    console.error(logTemplate(errMessage, 'error'));
    return res.status(500).json({ error: 'Error getting divisions' });
  }
}

export { getDivisionsApiHandler };
