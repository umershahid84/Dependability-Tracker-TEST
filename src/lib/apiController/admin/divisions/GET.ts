import {Request} from 'express';
import type {NextApiResponse} from 'next';
import type {ApiData} from '../../index';
import {getDivisionFromDB} from '../../../db/controller';
import {DivisionAttributes} from '../../../db/models/types';
import {getJwtTokenForAPI, JwtPayload, Redirect} from '../../../../auth';

export default async function getDivisionsApiHandler(
  req: Request,
  res: NextApiResponse<ApiData<DivisionAttributes[]>>
) {
  const token: JwtPayload | Redirect | undefined = getJwtTokenForAPI(req, res);

  if (!token || (token as Redirect)?.redirect) {
    return res.status(401).json({error: 'Unauthorized request'});
  }

  try {
    const divisions = await getDivisionFromDB.all();

    return res.status(200).json({data: divisions});
  } catch (error) {
    console.error('Error getting divisions:', error);
    return res.status(500).json({error: 'Error getting divisions'});
  }
}

export {getDivisionsApiHandler};
