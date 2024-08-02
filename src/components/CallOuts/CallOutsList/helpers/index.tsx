import { CallOutSortBy } from '../data';
import { NextRouter } from 'next/router';
import { sortCallOutsBy } from './sortCallOutsBy';
import { CallOutsListItem } from '../CallOutsListItem';
import { trim } from '../../../../lib/utils/shared/strings';
import { useEffect, useState, SetStateAction } from 'react';
import type { GetAllCallOutOptions } from '../../../../lib/db/controller/Callout/helpers';
import { ModelWithPagination, PaginationQueryParams } from '../../../../lib/db/controller';
import { CallOutWithAssociations, LeaveTypeAttributes } from '../../../../lib/db/models/types';

export const defaultStyles = {
  span: 'w-auto flex flex-col sm:flex-wrap sm:flex-row gap-4 sm:justify-center items-center',
  addCallOutsBtn: trim(`px-4 py-2 bg-accent-primary  text-center hover:bg-black 
  text-primary rounded-md text-sm w-26  hide-on-print`)
};

export type RenderCallOutsListProps = {
  data: CallOutWithAssociations[];
  onModalDeleteCallBack: (callOutId: string) => void;
  onModalEditCallBack: (callOut: CallOutWithAssociations) => void;
};

export function RenderCallOutsList({
  data,
  onModalDeleteCallBack,
  onModalEditCallBack
}: Readonly<RenderCallOutsListProps>) {
  return data?.map((callOut: CallOutWithAssociations) => (
    <CallOutsListItem
      key={callOut.id}
      callOut={callOut}
      onModalEditCallBack={onModalEditCallBack}
      onModalDeleteCallBack={onModalDeleteCallBack}
    />
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
  employee_id: undefined,
  callout_date: undefined,
  supervisor_id: undefined,
  leave_type_id: undefined,
  left_early_mins: undefined,
  shift_date_range: undefined,
  shift_time_range: undefined,
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

  return { searchParams, setSearchParams, handleSearchParamsChange };
};

export type HandleSortOnChangeProps = {
  leaveTypes: LeaveTypeAttributes[];
  e: React.ChangeEvent<HTMLSelectElement>;
  callOuts: ModelWithPagination<CallOutWithAssociations>;
  setSortBy: React.Dispatch<SetStateAction<CallOutSortBy>>;
  setCallOuts: React.Dispatch<
    React.SetStateAction<ModelWithPagination<CallOutWithAssociations> | null>
  >;
};

export const handleSortChange = ({
  e,
  callOuts,
  setSortBy,
  leaveTypes,
  setCallOuts
}: HandleSortOnChangeProps) => {
  const sort = e.target.value as CallOutSortBy;
  setSortBy(sort);

  return sortCallOutsBy({ sort, callOuts, setCallOuts, leaveTypes });
};
