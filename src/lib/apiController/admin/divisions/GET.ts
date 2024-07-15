import {Request} from 'express';
import type {ApiData} from '../../index';
import type {NextApiResponse} from 'next';
import {getDivisionFromDB} from '../../../db/controller';
import {DivisionAttributes} from '../../../db/models/types';
import {getJwtTokenForAPI, JwtPayload} from '../../../../auth';

export default async function getDivisionsApiHandler(
  req: Request,
  res: NextApiResponse<ApiData<DivisionAttributes[]>>
) {
  const token: JwtPayload | undefined = getJwtTokenForAPI(req, res);

  if (!token || !token.isAdmin) {
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
