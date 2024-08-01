// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { Request, Response } from 'express';
import { getJwtTokenForAPI } from '../../../../auth';
import type { ApiData } from '../../../../lib/apiController';
import { CallOutWithAssociations } from '../../../../lib/db/models/Callout';
import { GetAllCallOutOptions } from '../../../db/controller/Callout/helpers';
import { getCallOutFromDB, ModelWithPagination } from '../../../../lib/db/controller';
import { logTemplate } from '../../../utils/server';

// inviteToken, password, email

export default async function getCallOutsApiHandler( //NOSONAR
  req: Request,
  res: Response<ApiData<ModelWithPagination<CallOutWithAssociations>>>
) {
  // Allow Admins and Supervisors to access this route
  await getJwtTokenForAPI(req, res);

  let { sortBy, limit, offset, callOutSearchOptions } = req.query as {
    sortBy: string | undefined;
    limit: string | undefined;
    offset: string | undefined;
    callOutSearchOptions: GetAllCallOutOptions | undefined;
  };

  if (callOutSearchOptions) {
    callOutSearchOptions = JSON.parse(callOutSearchOptions as string) as GetAllCallOutOptions;
  }

  if (limit === '-1') {
    limit = undefined;
  }

  const getCallOutsOptions: GetAllCallOutOptions = callOutSearchOptions ?? {};

  const callOuts: ModelWithPagination<CallOutWithAssociations> = (await getCallOutFromDB.all(
    getCallOutsOptions,
    { limit, offset, sortBy }
  )) as ModelWithPagination<CallOutWithAssociations>;

  try {
    return res.status(200).json({
      data: callOuts
    });
  } catch (error) {
    const errMessage = '❌ Error in getCallOutsApiHandler:' + ' ' + error;
    console.error(logTemplate(errMessage, 'error'));
    return res.status(500).json({ error: String(error) });
  }
}

export { getCallOutsApiHandler };
