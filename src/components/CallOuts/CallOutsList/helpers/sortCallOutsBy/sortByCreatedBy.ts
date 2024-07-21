import {makeDate} from '../../../../../lib/utils';
import type {CallOutWithAssociations} from '../../../../../lib/db/models/types';

export function sortCallOutsByCreatedBy(
  callOuts: CallOutWithAssociations[]
): CallOutWithAssociations[] {
  const sorted: CallOutWithAssociations[] = [];
  const supervisorCallOutMap: Record<string, CallOutWithAssociations[]> = {};

  // add the callOuts to the map by supervisor
  callOuts.forEach(callOut => {
    const supervisorId = callOut.supervisor.id;
    if (!supervisorCallOutMap[supervisorId]) {
      supervisorCallOutMap[supervisorId] = [];
    }
    supervisorCallOutMap[supervisorId].push(callOut);
  });

  const sortedAlphabeticallySupervisorIds = Object.keys(supervisorCallOutMap).sort((a, b) =>
    supervisorCallOutMap[a][0].supervisor.supervisor_info.name.localeCompare(
      supervisorCallOutMap[b][0].supervisor.supervisor_info.name
    )
  );

  // by the sorted supervisor ids, add the callOuts to the sorted array, sorting by created at
  sortedAlphabeticallySupervisorIds.forEach(supervisorId => {
    const currentCallOuts = supervisorCallOutMap[supervisorId];
    const sortedCallOuts = currentCallOuts.toSorted(
      (a, b) => makeDate(b.createdAt).getTime() - makeDate(a.createdAt).getTime()
    );
    sorted.push(...sortedCallOuts);
  });
  return sorted;
}
