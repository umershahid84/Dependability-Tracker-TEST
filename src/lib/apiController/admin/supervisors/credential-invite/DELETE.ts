import { Request, Response } from 'express';
import type { ApiData } from '../../../index';
import { logTemplate } from '../../../../utils/server';
import { CreateCredentialsInvite } from '../../../../db';
import { getSupervisorFromDB } from '../../../../db/controller';
import { SupervisorWithAssociations } from '../../../../db/models/Supervisor';

export default async function deleteSupervisorCredentialInviteApiHandler(
  req: Request,
  res: Response<ApiData<SupervisorWithAssociations | null>>
) {
  try {
    const { body } = req as { body: { forSupervisor: string } };

    const forSupervisorId = body.forSupervisor;

    const deleted = await CreateCredentialsInvite.destroy({
      where: { supervisor_id: forSupervisorId }
    });

    if (deleted === 0) {
      throw new Error('Error deleting invite. Zero rows affected');
    }

    const updatedSupervisor: SupervisorWithAssociations | null = await getSupervisorFromDB.byId(
      forSupervisorId,
      {
        showCredentials: true,
        showCreateCredentialsInvite: true
      }
    );

    return res.status(200).json({ message: 'Invite created successfully', data: updatedSupervisor });
  } catch (error) {
    const errMessage = '❌ Error in deleteSupervisorCredentialInviteApiHandler:' + ' ' + error;
    console.error(logTemplate(errMessage, 'error'));
    return res.status(500).json({ error: String(error) });
  }
}

export { deleteSupervisorCredentialInviteApiHandler };
