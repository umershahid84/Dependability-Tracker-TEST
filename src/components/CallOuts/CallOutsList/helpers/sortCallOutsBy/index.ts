import React from 'react';
import {CallOutSortBy} from '../../data';
import type {
  LeaveTypeAttributes,
  CallOutWithAssociations
} from '../../../../../lib/db/models/types';
import {makeDate} from '../../../../../lib/utils';
import {sortCallOutsByTardiness} from './sortByTardiness';
import {sortCallOutsByLeaveType} from './sortByLeaveType';
import {sortCallOutsByCreatedBy} from './sortByCreatedBy';
import {sortCallOutsByEmployeeName} from './byEmployeeName';
import {ModelWithPagination} from '../../../../../lib/db/controller';

export type SortCallOutsByProps = {
  sort: CallOutSortBy;
  leaveTypes: LeaveTypeAttributes[];
  callOuts: ModelWithPagination<CallOutWithAssociations>;
  setCallOuts: React.Dispatch<
    React.SetStateAction<ModelWithPagination<CallOutWithAssociations> | null>
  >;
};

export function sortByDateAndTime(
  a: CallOutWithAssociations,
  b: CallOutWithAssociations,
  attribute: keyof CallOutWithAssociations
) {
  const [dateA, timeA] = makeDate(a[attribute] as Date)
    .toISOString()
    .split('T');
  const [dateB, timeB] = makeDate(b[attribute] as Date)
    .toISOString()
    .split('T');

  if (dateA === dateB) {
    return timeB.localeCompare(timeA);
  }

  return dateB.localeCompare(dateA);
}

export function sortCallOutsBy({sort, callOuts, setCallOuts, leaveTypes}: SortCallOutsByProps) {
  let currentCallOuts: CallOutWithAssociations[] = [...(callOuts?.data ?? [])];

  switch (sort) {
    case 'leaveType':
      currentCallOuts = sortCallOutsByLeaveType(currentCallOuts, leaveTypes);
      break;
    case 'employeeName':
      currentCallOuts = sortCallOutsByEmployeeName(currentCallOuts);
      break;
    case 'createdBy':
      currentCallOuts = sortCallOutsByCreatedBy(currentCallOuts);
      break;
    case 'callDate':
      currentCallOuts = currentCallOuts.sort((a, b) => sortByDateAndTime(a, b, 'callout_date'));
      break;
    case 'shiftDate': {
      currentCallOuts = currentCallOuts.sort((a, b) => sortByDateAndTime(a, b, 'shift_date'));
      break;
    }
    case 'arrivedLate':
      currentCallOuts = sortCallOutsByTardiness(currentCallOuts, 'arrived_late_mins');
      break;
    case 'leftEarly':
      currentCallOuts = sortCallOutsByTardiness(currentCallOuts, 'left_early_mins');
      break;
    case 'createdAt':
      currentCallOuts = currentCallOuts.sort((a, b) => sortByDateAndTime(a, b, 'createdAt'));
      break;
    case 'updatedAt':
      currentCallOuts = currentCallOuts.sort((a, b) => sortByDateAndTime(a, b, 'updatedAt'));
      break;
    default:
      break;
  }

  setCallOuts({
    data: currentCallOuts,
    limit: callOuts?.limit ?? 5,
    offset: callOuts?.offset ?? 0,
    numRecords: callOuts?.numRecords ?? 0
  });
}
