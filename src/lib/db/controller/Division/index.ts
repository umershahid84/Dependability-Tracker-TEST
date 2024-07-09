// CRUD controller for the Division model
import {Division} from '../../models';
import {validateDivisionName} from './helpers';
import {DivisionAttributes, DivisionCreationAttributes} from '../../models/types';

// (C)reate
export const createDivisionInDB = async (
  withDivisionData: DivisionCreationAttributes
): Promise<DivisionAttributes | null> => {
  validateDivisionName(withDivisionData.name);
  try {
    const createdDivision = (await Division.create(withDivisionData)).get({
      plain: true
    }) as DivisionAttributes;
    return createdDivision;
  } catch (error) {
    throw new Error(`\n❌ Error creating division: ${error}`);
  }
};

// (R)ead
export const getDivisionFromDB = {
  byId: async (divisionId: string): Promise<DivisionAttributes | null> => {
    try {
      const division: DivisionAttributes | null | undefined = (
        await Division.findByPk(divisionId)
      )?.get({
        plain: true
      });
      return division ?? null;
    } catch (error) {
      // istanbul ignore next
      throw new Error(`\n❌ Error fetching division: ${error}`);
    }
  },
  byName: async (divisionName: string): Promise<DivisionAttributes | null> => {
    try {
      const division: DivisionAttributes | null | undefined = (
        await Division.findOne({
          where: {name: divisionName}
        })
      )?.get({plain: true});

      return division ?? null;
    } catch (error) {
      // istanbul ignore next
      throw new Error(`\n❌ Error fetching division: ${error}`);
    }
  },
  all: async (): Promise<DivisionAttributes[]> => {
    try {
      const divisions: DivisionAttributes[] = (await Division.findAll()).map(division =>
        division.get({plain: true})
      );
      return divisions;
    } catch (error) {
      // istanbul ignore next
      throw new Error(`\n❌ Error fetching divisions: ${error}`);
    }
  }
};

// (U)pdate
export const updateDivisionInDB = async (
  divisionId: string,
  divisionName: string
): Promise<DivisionAttributes | null> => {
  validateDivisionName(divisionName);
  try {
    const division = await Division.findByPk(divisionId);
    if (division) {
      division.name = divisionName;
      await division.save();
      return division;
    }
    return null;
  } catch (error) {
    throw new Error(`\n❌ Error updating division: ${error}`);
  }
};
// (D)elete
export const deleteDivisionFromDB = async (divisionId: string): Promise<boolean> => {
  try {
    const division = await Division.findByPk(divisionId);
    if (division) {
      await division.destroy();
      return true;
    }
    return false;
  } catch (error) {
    // istanbul ignore next
    throw new Error(`\n❌ Error deleting division: ${error}`);
  }
};

export const divisionModelController = {
  getDivisionFromDB,
  createDivisionInDB,
  updateDivisionInDB,
  deleteDivisionFromDB
};

export default divisionModelController;
