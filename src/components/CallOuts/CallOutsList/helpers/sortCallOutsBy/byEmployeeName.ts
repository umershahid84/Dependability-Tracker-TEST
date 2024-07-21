import {sortByDateAndTime} from '.';
import type {CallOutWithAssociations} from '../../../../../lib/db/models/types';

export function sortCallOutsByEmployeeName(
  usingCallOuts: CallOutWithAssociations[]
): CallOutWithAssociations[] {
  const employeeCallOutMap = <Record<string, CallOutWithAssociations[]>>{};

  // add the callOuts to the map
  usingCallOuts.forEach(callOut => {
    const employeeId = callOut.employee.id;
    if (!employeeCallOutMap[employeeId]) {
      employeeCallOutMap[employeeId] = [];
    }
    employeeCallOutMap[employeeId].push(callOut);
  });

  // sort the callOuts by the employee name, alphabetically, and then by the created at date so their most recent callOuts are at the top
  let sortedCallOuts: CallOutWithAssociations[] = [];

  const sortedAlphabeticallyEmployeeIds = Object.keys(employeeCallOutMap).sort((a, b) =>
    employeeCallOutMap[a][0].employee.name.localeCompare(employeeCallOutMap[b][0].employee.name)
  );

  sortedAlphabeticallyEmployeeIds.forEach(employeeId => {
    const currentCallOuts = employeeCallOutMap[employeeId];
    currentCallOuts &&
      sortedCallOuts.push(
        ...currentCallOuts.toSorted((a, b) => sortByDateAndTime(a, b, 'createdAt'))
      );
  });

  return sortedCallOuts;
}
