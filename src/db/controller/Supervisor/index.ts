// CRUD controller for the Supervisor Model

import {
  SupervisorAttributes,
  SupervisorWithAssociations,
  SupervisorCreationAttributes
} from '../../models/Supervisor';
import {uuidV4Regex} from '../../../utils';
import {populateEmployeeWithDivisions} from '../Employee/helpers';
import {Employee, LoginCredential, Supervisor} from '../../models';

// (C)reate
export const createSupervisorInDB = async (
  supervisor: SupervisorCreationAttributes
): Promise<SupervisorWithAssociations | null> => {
  const created: SupervisorAttributes | undefined = (await Supervisor.create(supervisor)).get({
    plain: true
  });
  // istanbul ignore next
  return created ? (await getSupervisorFromDB.byId(created?.id)) ?? null : null;
};

// (R)ead
export const getSupervisorFromDB = {
  byId: async (id: string): Promise<SupervisorWithAssociations | null> => {
    const superV: SupervisorWithAssociations | null = ((
      await Supervisor.findByPk(id, {
        include: [
          {
            model: Employee,
            as: 'supervisor_info'
          },
          {
            model: LoginCredential,
            as: 'login_credentials'
          }
        ]
      })
    )?.get({plain: true}) ?? null) as SupervisorWithAssociations | null;

    if (!superV) return null;

    // istanbul ignore next
    return {
      id: superV?.id,
      is_admin: superV?.is_admin,
      createdAt: superV?.createdAt,
      updatedAt: superV?.updatedAt,
      login_credentials: superV?.login_credentials as LoginCredential,
      supervisor_info: await populateEmployeeWithDivisions(superV?.supervisor_info as Employee)
    };
  }
};

// (U)pdate
export const updateSupervisorInDB = {
  setAdminStatus: async (
    id: string,
    isAdmin: boolean
  ): Promise<SupervisorWithAssociations | null> => {
    // validate that the isAdmin value is a boolean
    if (typeof isAdmin !== 'boolean') {
      throw new Error('isAdmin must be a boolean');
    }
    if (!uuidV4Regex.test(id)) throw new Error('Invalid ID');

    const updated: number[] = await Supervisor.update({is_admin: isAdmin}, {where: {id}});
    // istanbul ignore next
    return updated ? (await getSupervisorFromDB.byId(id)) ?? null : null;
  }
};

// (D)elete
export const deleteSupervisorFromDB = async (id: string): Promise<boolean> => {
  if (!id) throw new Error('ID is required');
  if (!uuidV4Regex.test(id)) throw new Error('Invalid ID');
  const deleted: number = await Supervisor.destroy({where: {id}});
  return deleted > 0;
};

export const supervisorModelController = {
  getSupervisorFromDB,
  updateSupervisorInDB,
  createSupervisorInDB,
  deleteSupervisorFromDB
};
