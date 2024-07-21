import {sortByDateAndTime} from '.';
import type {CallOutWithAssociations} from '../../../../../lib/db/models/types';

export function sortCallOutsByTardiness(
  callOuts: CallOutWithAssociations[],
  attribute: 'arrived_late_mins' | 'left_early_mins'
): CallOutWithAssociations[] {
  const callOutsWhereEmployeeLeftEarly = callOuts
    .filter(callOut => callOut[attribute] !== null && callOut[attribute] > 0)
    .sort((a, b) => {
      // if they are the same, sort by created at
      if (a[attribute] === b[attribute]) {
        return sortByDateAndTime(a, b, 'createdAt');
      }
      return (b[attribute] ?? 0) - (a[attribute] ?? 0);
    });

  const rebuiltCallOuts: CallOutWithAssociations[] = [
    ...callOutsWhereEmployeeLeftEarly,
    ...callOuts.filter(callOut => !callOutsWhereEmployeeLeftEarly.includes(callOut))
  ];

  return rebuiltCallOuts;
}
