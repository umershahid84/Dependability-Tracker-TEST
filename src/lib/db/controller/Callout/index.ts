// CRUD controller for the Callout Model
import {
  CallOutAttributes,
  CallOutWithAssociations,
  CallOutCreationAttributes
} from '../../models/types';
import {
  validateCallOutProps,
  EditableCalloutProps,
  GetAllCallOutOptions,
  buildEditableCalloutProps,
  buildCalloutAllQueryOptions,
  populateCallOutAssociations
} from './helpers';
import {CallOut} from '../../models';
import {uuidV4Regex} from '../../../utils';
import {ModelWithPagination, PaginationQueryParams, convertOptions} from '..';

// (C)reate
export const createCallOutInDB = async (
  props: CallOutCreationAttributes
): Promise<CallOutWithAssociations | null> => {
  await validateCallOutProps(props);
  try {
    const callout: CallOutAttributes = (await CallOut.create(props)).get({plain: true});
    // istanbul ignore next
    return callout ? await populateCallOutAssociations(callout) : null;
  } catch (error) {
    throw new Error(`\n❌ Error creating callout: ${String(error)}`);
  }
};

// (R)ead
export const getCallOutFromDB = {
  byId: async (id: string): Promise<CallOutWithAssociations | null> => {
    if (!id) throw new Error('Missing required id');
    if (!uuidV4Regex.test(id)) throw new Error('Invalid id');
    const callout: CallOutAttributes | null = ((await CallOut.findByPk(id))?.get({plain: true}) ??
      null) as CallOutAttributes | null;

    return callout ? await populateCallOutAssociations(callout) : null;
  },
  // Methods to get more than one callout
  all: async (
    options?: GetAllCallOutOptions,
    paginationOptions?: PaginationQueryParams
  ): Promise<CallOutWithAssociations[] | ModelWithPagination<CallOutWithAssociations>> => {
    const where = options ? buildCalloutAllQueryOptions(options) : {};
    const pageOptions = paginationOptions ?? {};
    const convertedOptions = convertOptions(pageOptions);

    try {
      const callOuts: CallOutAttributes[] = (
        await CallOut.findAll({
          where: {...where},
          limit: convertedOptions.limit,
          order: convertedOptions.order,
          offset: convertedOptions.offset
        })
      )?.map(callout => callout.get({plain: true}));

      const _callOuts =
        (await Promise.all(callOuts.map(populateCallOutAssociations))).filter(el => el !== null) ??
        [];

      if (!paginationOptions || Object.keys(paginationOptions).length === 1) {
        return _callOuts;
      } else {
        const totalRecords = await CallOut.count({where: {...where}});

        return {
          data: _callOuts ?? [],
          limit: convertedOptions.limit ?? 0,
          offset: convertedOptions.offset ?? 0,
          numRecords: totalRecords
        };
      }
    } catch (error) {
      // istanbul ignore next
      throw new Error(`\n❌ Error fetching callouts: ${String(error)}`);
    }
  }
};

// (U)pdate
export const updateCallOutInDB = async (
  forId: string,
  withNewProps: EditableCalloutProps
): Promise<CallOutWithAssociations | null> => {
  if (!forId) throw new Error('Missing required id');
  if (!uuidV4Regex.test(forId)) throw new Error('Invalid id');
  // ensure dates and times are updated accordingly
  const data = await buildEditableCalloutProps(forId, withNewProps);
  withNewProps = data[0];

  const callout = data[1];

  try {
    // istanbul ignore next
    if (!callout) throw new Error('Callout not found');

    const updatedCallout: CallOutAttributes = (await callout.update({...withNewProps})).get({
      plain: true
    });
    return updatedCallout ? await populateCallOutAssociations(updatedCallout) : null;
  } catch (error) {
    // istanbul ignore next
    throw new Error(`\n❌ Error updating callout: ${String(error)}`);
  }
};

// (D)elete
export const deleteCallOutFromDB = async (id: string): Promise<boolean> => {
  if (!id) throw new Error('Missing required id');
  if (!uuidV4Regex.test(id)) throw new Error('Invalid id');

  try {
    const callout: CallOut | null = (await CallOut.findByPk(id)) ?? null;

    // istanbul ignore next
    if (!callout) throw new Error('Callout not found');

    await callout.destroy();
    return true;
  } catch (error) {
    // istanbul ignore next
    throw new Error(`\n❌ Error deleting callout: ${String(error)}`);
  }
};

export const calloutModelController = {
  getCallOutFromDB,
  updateCallOutInDB,
  createCallOutInDB,
  deleteCallOutFromDB
};

export default calloutModelController;
