import {
  sortSupervisors,
  SupervisorsSortBy,
  supervisorListStyles,
  supervisorsSortOptions
} from './data';
import Loading from '../../Loading';
import { useEffect, useState } from 'react';
import { DynamicSortOptions } from '../../Forms';
import { employeeLimitOptions } from '../../Employees';
import { SupervisorListItem } from './SupervisorListItem';
import { ModelList, ModelListHeader } from '../../ModelList';
import { PaginationContainer } from '../../Pagination/Container';
import type { SupervisorWithAssociations } from '../../../lib/db/models/Supervisor';
import { PaginationQueryParams, ModelWithPagination } from '../../../lib/db/controller';
import { UseGetSupervisors, useGetSupervisors, useQueryParams, UseQueryParams } from '../../../hooks';

const defaultSupervisorsQueryParams: PaginationQueryParams<SupervisorsSortBy> & {
  showCredentials: 'true' | 'false';
  showCreateCredentialsInvite: 'true' | 'false';
} = {
  limit: '5',
  offset: '0',
  sortBy: 'name',
  showCredentials: 'true',
  showCreateCredentialsInvite: 'true'
};

function RenderList({
  data,
  onModalEditCallBack,
  onModalDeleteCallBack
}: Readonly<{
  data: SupervisorWithAssociations[];
  onModalDeleteCallBack: (supervisorId: string) => void;
  onModalEditCallBack: (supervisor: SupervisorWithAssociations, isNew?: boolean) => void;
}>) {
  return data?.map((supervisor: SupervisorWithAssociations) => (
    <SupervisorListItem
      key={supervisor.id}
      supervisor={supervisor}
      onModalEditCallBack={onModalEditCallBack}
      onModalDeleteCallBack={onModalDeleteCallBack}
    />
  ));
}

export function SupervisorsList() {
  const [sortBy, setSortBy] = useState<SupervisorsSortBy>('name');
  const [supervisorData, setSupervisorData] =
    useState<ModelWithPagination<SupervisorWithAssociations> | null>(null);
  const { queryParams, setQueryParams, handleQueryParamChange }: UseQueryParams<SupervisorsSortBy> =
    useQueryParams<SupervisorsSortBy>(defaultSupervisorsQueryParams);
  const { supervisors }: UseGetSupervisors = useGetSupervisors(queryParams);

  const handleOnSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortBy(e.target.value as SupervisorsSortBy);
  };

  const onModalEditCallBack = (supervisor: SupervisorWithAssociations, isNew = false) => {
    if (!isNew) {
      // find the supervisor with the same id and update the data in the supervisorData
      const updatedData =
        supervisorData?.data.map(sup => {
          if (sup.id === supervisor.id) {
            return supervisor;
          }
          return sup;
        }) ?? [];

      setSupervisorData({
        ...(supervisorData as ModelWithPagination<SupervisorWithAssociations>),
        data: updatedData
      });
    } else {
      // if this is a new supervisor, add them to the supervisorData
      setSupervisorData({
        ...(supervisorData as ModelWithPagination<SupervisorWithAssociations>),
        data: [supervisor, ...(supervisorData?.data ?? [])]
      });
    }
  };

  const onModalDeleteCallBack = (supervisorId: string) => {
    const updatedData =
      supervisorData?.data.filter(supervisor => supervisor.id !== supervisorId) ?? [];

    setSupervisorData({
      ...(supervisorData as ModelWithPagination<SupervisorWithAssociations>),
      data: updatedData
    });
  };

  useEffect(() => {
    if (supervisors?.data) {
      const data = sortSupervisors(sortBy, supervisors.data);
      setSupervisorData({
        ...supervisors,
        data
      });
    }
  }, [supervisors, sortBy]);

  return supervisors ? (
    <ModelList>
      <ModelListHeader
        title="Supervisors"
        containerClassName={supervisorListStyles.containerClassName}>
        <DynamicSortOptions
          name="limit"
          label="Limit:"
          sortOptions={employeeLimitOptions}
          onSortChange={handleQueryParamChange}
          currentSort={String(queryParams.limit ?? 5)}
          title="Limit the number of employees displayed."
        />

        <DynamicSortOptions
          name="sortBy"
          label="Sort By:"
          currentSort={sortBy as string}
          onSortChange={handleOnSortChange}
          sortOptions={supervisorsSortOptions}
          title="Sort the supervisors by the selected option."
        />



      </ModelListHeader>

      <PaginationContainer
        data={supervisorData}
        queryParams={queryParams}
        RenderList={RenderList as any}
        setQueryParams={setQueryParams}
        onModalEditCallBack={onModalEditCallBack}
        onModalDeleteCallBack={onModalDeleteCallBack}
      />
    </ModelList>
  ) : (
    <Loading />
  );
}
