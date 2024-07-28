// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import {Request, Response} from 'express';
import {ApiData} from '../../../../lib/apiController';
import {SupervisorOptions} from '../../../db/controller/Supervisor/helpers';
import {SupervisorWithAssociations} from '../../../../lib/db/models/Supervisor';
import {EmployeeLimit} from '../../../../components/Employees/EmployeeList/data';
import {getSupervisorFromDB, ModelWithPagination} from '../../../../lib/db/controller';

export type booleanOrString = 'true' | 'false' | boolean;
const limits: EmployeeLimit[] = ['5', '10', '25', '50', '100', '-1'];

export async function getSupervisorsApiHandler(
  req: Request,
  res: Response<
    ApiData<ModelWithPagination<SupervisorWithAssociations> | SupervisorWithAssociations[]>
  >
) {
  let {limit, offset, showCredentials, showCreateCredentialsInvite} = req.query as {
    offset: string | undefined;
    limit: EmployeeLimit | undefined;
    showCredentials: booleanOrString | undefined;
    showCreateCredentialsInvite: booleanOrString | undefined;
  };

  if (limit === '-1') {
    limit = undefined;
  }

  if (limit && !limits.includes(limit)) {
    limit = undefined;
  }

  if (offset && isNaN(Number(offset))) {
    offset = undefined;
  }

  if (showCredentials !== 'true' && showCredentials !== 'false') {
    showCredentials = undefined;
  }

  if (showCreateCredentialsInvite !== 'true' && showCreateCredentialsInvite !== 'false') {
    showCreateCredentialsInvite = undefined;
  }

  showCreateCredentialsInvite = Boolean(showCreateCredentialsInvite);
  showCredentials = Boolean(showCredentials);

  const supervisors:
    | ModelWithPagination<SupervisorWithAssociations>
    | SupervisorWithAssociations[] = await getSupervisorFromDB.all({
    limit,
    offset,
    showCredentials,
    showCreateCredentialsInvite
  } as SupervisorOptions);

  return res.status(200).json({data: supervisors});
}

export const config = {
  api: {
    externalResolver: true,
    bodyParser: true
  }
};
