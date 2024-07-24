// CRUD controller for the Supervisor Model
import {
  SupervisorAttributes,
  SupervisorWithAssociations,
  SupervisorCreationAttributes
} from '../../models/Supervisor';
import {convertOptions} from '../';
import {ModelWithPagination} from '..';
import {uuidV4Regex} from '../../../utils';
import {CreateCredentialsInvite, Employee, LoginCredential, Supervisor} from '../../models';
import {SupervisorOptions, createSupervisorInclude, handleOptionalReturnValues} from './helpers';

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
  byId: async (
    id: string,
    options?: SupervisorOptions
  ): Promise<SupervisorWithAssociations | null> => {
    const superV: SupervisorWithAssociations | null = ((
      await Supervisor.findByPk(id, {
        include: [
          {
            model: Employee,
            as: 'supervisor_info'
          },
          ...createSupervisorInclude(options ?? {})
        ]
      })
    )?.get({plain: true}) ?? null) as SupervisorWithAssociations | null;

    // istanbul ignore next
    if (!superV) return null;

    return handleOptionalReturnValues(superV, options ?? {});
  },
  all: async (
    options?: SupervisorOptions
  ): Promise<SupervisorWithAssociations[] | ModelWithPagination<SupervisorWithAssociations>> => {
    const paginationOptions = options ?? {};
    const convertedPaginationOptions = convertOptions(paginationOptions);

    const supervisors: Promise<SupervisorWithAssociations | null>[] = (
      await Supervisor.findAll({
        include: [
          {
            model: Employee,
            as: 'supervisor_info'
          },
          ...createSupervisorInclude(options ?? {})
        ],
        ...convertedPaginationOptions
      })
    ).map(async (supervisor: Supervisor) => {
      const superV: SupervisorWithAssociations | null = supervisor.get({
        plain: true
      }) as unknown as SupervisorWithAssociations | null;

      // istanbul ignore next
      if (!superV) return null;

      return handleOptionalReturnValues(superV, options ?? {});
    });

    const filtered = (await Promise.all(supervisors)).filter(el => el !== null);

    if (Object.keys(convertedPaginationOptions).length === 1) {
      return filtered;
    } else {
      return {
        data: filtered,
        limit: convertedPaginationOptions.limit ?? 0,
        offset: convertedPaginationOptions.offset ?? 0,
        numRecords: await Supervisor.count()
      };
    }
  },
  admins: async (
    options?: SupervisorOptions
  ): Promise<SupervisorWithAssociations[] | ModelWithPagination<SupervisorWithAssociations>> => {
    const paginationOptions = options ?? {};
    const convertedPaginationOptions = convertOptions(paginationOptions);

    const supervisors: Promise<SupervisorWithAssociations | null>[] = (
      await Supervisor.findAll({
        where: {is_admin: true},
        include: [
          {
            model: Employee,
            as: 'supervisor_info'
          },
          ...createSupervisorInclude(options ?? {})
        ],
        ...convertedPaginationOptions
      })
    ).map(async (supervisor: Supervisor) => {
      const superV: SupervisorWithAssociations | null = supervisor.get({
        plain: true
      }) as unknown as SupervisorWithAssociations | null;

      // istanbul ignore next
      if (!superV) return null;

      return handleOptionalReturnValues(superV, options ?? {});
    });
    const filtered = (await Promise.all(supervisors)).filter(el => el !== null);

    if (Object.keys(convertedPaginationOptions).length === 1) {
      return filtered;
    } else {
      return {
        data: filtered,
        limit: convertedPaginationOptions.limit ?? 0,
        offset: convertedPaginationOptions.offset ?? 0,
        numRecords: filtered.length
      };
    }
  },
  byEmployeeId: async (
    employeeId: string,
    options?: SupervisorOptions
  ): Promise<SupervisorWithAssociations | null> => {
    const superV: SupervisorWithAssociations | null = ((
      await Supervisor.findOne({
        where: {employee_id: employeeId},
        include: [
          {
            model: Employee,
            as: 'supervisor_info'
          },
          ...createSupervisorInclude(options ?? {})
        ]
      })
    )?.get({plain: true}) ?? null) as SupervisorWithAssociations | null;

    // istanbul ignore next
    if (!superV) return null;

    return handleOptionalReturnValues(superV, options ?? {});
  }
};

// (U)pdate
export const updateSupervisorInDB = {
  setAdminStatus: async (
    id: string,
    isAdmin: boolean,
    options?: SupervisorOptions
  ): Promise<SupervisorWithAssociations | null> => {
    // validate that the isAdmin value is a boolean
    if (typeof isAdmin !== 'boolean') {
      throw new Error('isAdmin must be a boolean');
    }
    if (!uuidV4Regex.test(id)) throw new Error('Invalid ID');

    const updated: number[] = await Supervisor.update({is_admin: isAdmin}, {where: {id}});
    // istanbul ignore next
    return updated ? (await getSupervisorFromDB.byId(id, options)) ?? null : null;
  }
};

// (D)elete
// Does not delete the employee associated with the supervisor
export const deleteSupervisorFromDB = async (id: string): Promise<boolean> => {
  if (!id) throw new Error('ID is required');
  if (!uuidV4Regex.test(id)) throw new Error('Invalid ID');
  try {
    const deleted: number = await Supervisor.destroy({where: {id}});
    // delete any credentials or credential invites associated with the supervisor id
    await LoginCredential.destroy({where: {supervisor_id: id}});
    await CreateCredentialsInvite.destroy({where: {supervisor_id: id}});

    return deleted > 0;
  } catch (error) {
    // istanbul ignore next
    throw new Error(`\n❌ Error deleting supervisor: ${error}`);
  }
};

export const supervisorModelController = {
  getSupervisorFromDB,
  updateSupervisorInDB,
  createSupervisorInDB,
  deleteSupervisorFromDB
};
