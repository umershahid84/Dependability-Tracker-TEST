import {useEffect, useState} from 'react';
import {CallOutSortBy} from './data';
import {NextRouter} from 'next/router';
import {CallOutsListItem} from './CallOutsListItem';
import {trim} from '../../../lib/utils/shared/strings';
import {PaginationQueryParams} from '../../../lib/db/controller';
import {CallOutWithAssociations} from '../../../lib/db/models/types';
import type {GetAllCallOutOptions} from '../../../lib/db/controller/Callout/helpers';

export const defaultStyles = {
  span: 'w-auto flex flex-wrap flex-row gap-4 justify-start sm:justify-center items-center',
  addCallOutsBtn: trim(`px-4 py-2 bg-[var(--green)]  text-center hover:bg-black 
  text-white rounded-md text-sm w-26  hide-on-print`)
};

export function RenderCallOutsList({data}: Readonly<{data: CallOutWithAssociations[]}>) {
  return data?.map((callOut: CallOutWithAssociations) => (
    <CallOutsListItem key={callOut.id} callOut={callOut} />
  ));
}

export const handleAddCallOutClick = (e: React.SyntheticEvent, router: NextRouter) => {
  e.preventDefault();
  e.stopPropagation();

  router.push('/dashboard');
};

export const defaultCallOutsQueryParams: PaginationQueryParams<CallOutSortBy> = {
  limit: '5',
  offset: '0',
  sortBy: 'leaveType'
};

export const dbSearchParams: GetAllCallOutOptions = {
  id: undefined,
  createdAt: undefined,
  shift_date: undefined,
  shift_time: undefined,
  callout_date: undefined,
  callout_time: undefined,
  employee_id: undefined,
  supervisor_id: undefined,
  leave_type_id: undefined,
  shift_date_range: undefined,
  shift_time_range: undefined,
  left_early_mins: undefined,
  arrived_late_mins: undefined,
  callout_date_range: undefined,
  callout_time_range: undefined,
  left_early_mins_range: undefined,
  arrived_late_mins_range: undefined
};

export type UseDbSearchParamsFormState = {
  searchParams: GetAllCallOutOptions;
  setSearchParams: React.Dispatch<React.SetStateAction<GetAllCallOutOptions>>;
  handleSearchParamsChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
};

export const useDbSearchParamsFormState = (defaultParams?: GetAllCallOutOptions) => {
  const [searchParams, setSearchParams] = useState<GetAllCallOutOptions>(
    defaultParams ?? dbSearchParams
  );

  const handleSearchParamsChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setSearchParams({
      ...searchParams,
      [e.target.name]: e.target.value === '' ? undefined : e.target.value
    });
  };

  useEffect(() => {
    if (defaultParams) {
      setSearchParams(defaultParams);
    }
  }, [defaultParams]);

  return {searchParams, setSearchParams, handleSearchParamsChange};
};
