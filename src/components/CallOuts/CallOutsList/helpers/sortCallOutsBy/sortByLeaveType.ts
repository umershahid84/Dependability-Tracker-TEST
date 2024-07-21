import type {
  LeaveTypeAttributes,
  CallOutWithAssociations
} from '../../../../../lib/db/models/types';

import {makeDate} from '../../../../../lib/utils';

export function sortCallOutsByLeaveType(
  usingCallOuts: CallOutWithAssociations[],
  withLeaveTypes: LeaveTypeAttributes[]
): CallOutWithAssociations[] {
  let sortedCallOuts: CallOutWithAssociations[] = [];
  const leaveTypeToCallOutsMap: Record<string, CallOutWithAssociations[]> = {};

  // add the callOuts to the map
  usingCallOuts.forEach(callOut => {
    const leaveTypeId = callOut.leaveType.id;
    if (!leaveTypeToCallOutsMap[leaveTypeId]) {
      leaveTypeToCallOutsMap[leaveTypeId] = [];
    }
    leaveTypeToCallOutsMap[leaveTypeId].push(callOut);
  });

  withLeaveTypes.forEach(leaveType => {
    const currentCallOuts = leaveTypeToCallOutsMap[leaveType.id];

    if (currentCallOuts) {
      sortedCallOuts = [...sortedCallOuts, ...currentCallOuts];
    }
  });

  sortedCallOuts = sortedCallOuts.toSorted((a, b) => {
    if (a.leaveType.reason === b.leaveType.reason) {
      return makeDate(b.createdAt).getTime() - makeDate(a.createdAt).getTime();
    }
    return a.leaveType.reason.localeCompare(b.leaveType.reason);
  });

  return sortedCallOuts;
}
