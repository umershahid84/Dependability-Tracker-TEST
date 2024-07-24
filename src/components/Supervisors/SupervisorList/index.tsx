import {
  sortSupervisors,
  SupervisorsSortBy,
  supervisorListStyles,
  supervisorsSortOptions
} from './data';
import Loading from '../../Loading';
import {useEffect, useState} from 'react';
import {DynamicSortOptions} from '../../Forms';
import {employeeLimitOptions} from '../../Employees';
import {SupervisorListItem} from './SupervisorListItem';
import {ModelList, ModelListHeader} from '../../ModelList';
import {PaginationContainer} from '../../Pagination/Container';
import type {SupervisorWithAssociations} from '../../../lib/db/models/Supervisor';
import {PaginationQueryParams, ModelWithPagination} from '../../../lib/db/controller';
import {UseGetSupervisors, useGetSupervisors, useQueryParams, UseQueryParams} from '../../../hooks';

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

function RenderList({data}: Readonly<{data: SupervisorWithAssociations[]}>) {
  return data?.map((supervisor: SupervisorWithAssociations) => (
    <SupervisorListItem key={supervisor.id} supervisor={supervisor} />
  ));
}

export function SupervisorsList() {
  const [sortBy, setSortBy] = useState<SupervisorsSortBy>('name');
  const [supervisorData, setSupervisorData] =
    useState<ModelWithPagination<SupervisorWithAssociations> | null>(null);
  const {queryParams, setQueryParams, handleQueryParamChange}: UseQueryParams<SupervisorsSortBy> =
    useQueryParams<SupervisorsSortBy>(defaultSupervisorsQueryParams);
  const {supervisors, refetch}: UseGetSupervisors = useGetSupervisors(queryParams);

  const handleOnSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortBy(e.target.value as SupervisorsSortBy);
  };

  const handleOnSupervisorUpdate = () =>
    window.addEventListener('supervisorUpdated', () => refetch);

  const handleRemoveSupervisorUpdate = () =>
    window.removeEventListener('supervisorUpdated', () => refetch);

  useEffect(() => {
    handleOnSupervisorUpdate();
    return () => handleRemoveSupervisorUpdate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
        titleClassName="w-auto"
        containerClassName={supervisorListStyles.containerClassName}>
        <span className={supervisorListStyles.span}>
          <DynamicSortOptions
            name="sortBy"
            label="Sort By:"
            currentSort={sortBy as string}
            onSortChange={handleOnSortChange}
            sortOptions={supervisorsSortOptions}
            title="Sort the supervisors by the selected option."
          />
        </span>

        <DynamicSortOptions
          name="limit"
          label="Limit:"
          sortOptions={employeeLimitOptions}
          onSortChange={handleQueryParamChange}
          currentSort={String(queryParams.limit ?? 5)}
          title="Limit the number of employees displayed."
        />
      </ModelListHeader>

      <PaginationContainer
        data={supervisorData}
        RenderList={RenderList}
        queryParams={queryParams}
        setQueryParams={setQueryParams}
      />
    </ModelList>
  ) : (
    <Loading />
  );
}
