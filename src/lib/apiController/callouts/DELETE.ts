// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { Request, Response } from 'express';
import type { ApiData } from '../../../lib/apiController';
import { deleteCallOutFromDB } from '../../../lib/db/controller';
import { CallOutAttributes } from '../../../lib/db/models/Callout';
import { logTemplate } from '../../utils/server';

// inviteToken, password, email
export default async function deleteEmployeeCallOutApiHandler( //NOSONAR
  req: Request,
  res: Response<ApiData<CallOutAttributes['id']>>
) {
  try {
    const id = req?.body?.id as string;

    const callOut: boolean | null = await deleteCallOutFromDB(id);

    if (!callOut) {
      return res.status(500).json({ error: 'Failed to update callout' });
    }

    res.status(200).json({ message: 'Callout Updated Successfully', data: id });
  } catch (error) {
    const errMessage = '❌ Error in deleteEmployeeCallOutApiHandler:' + ' ' + error;
    console.error(logTemplate(errMessage, 'error'));
    return {
      error: String(error)
    };
  }
}

export { deleteEmployeeCallOutApiHandler };
