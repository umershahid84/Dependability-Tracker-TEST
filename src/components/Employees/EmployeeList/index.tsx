import {
  EmployeeSortBy,
  employeeListStyles,
  employeeSortOptions,
  employeeLimitOptions
} from './data';
import {useEffect} from 'react';
import {DynamicSortOptions} from '../../Forms';
import {ModalAction, ModalType} from '../../ Modal';
import {EmployeeListItem} from '../EmployeeListItem';
import {ModelList, ModelListHeader} from '../../ModelList';
import {PaginationContainer} from '../../Pagination/Container';
import {PaginationQueryParams, EmployeeWithAssociations} from '../../../lib/db/controller';
import {UseGetEmployees, useGetEmployees, UseQueryParams, useQueryParams} from '../../../hooks';

function RenderList({data}: {data: EmployeeWithAssociations[]}) {
  return data?.map((employee: EmployeeWithAssociations) => (
    <EmployeeListItem key={employee.id} employee={employee} />
  ));
}
const handleAddEmployeeClick = (e: React.SyntheticEvent) => {
  e.preventDefault();
  e.stopPropagation();

  window.dispatchEvent(
    new CustomEvent('modalEvent', {
      detail: {action: ModalAction.OPEN, type: ModalType.ADD_EMPLOYEE, payload: null}
    })
  );
};

export const defaultEmployeesQueryParams: PaginationQueryParams<EmployeeSortBy> = {
  limit: '5',
  offset: '0',
  sortBy: 'name'
};

export function EmployeeList() {
  const {queryParams, setQueryParams, handleQueryParamChange}: UseQueryParams<EmployeeSortBy> =
    useQueryParams<EmployeeSortBy>(defaultEmployeesQueryParams);
  const {employees, refetch}: UseGetEmployees = useGetEmployees(queryParams);

  useEffect(() => {
    //@ts-ignore
    window.addEventListener('employeeUpdated', async () => await refetch(queryParams));

    return () => {
      //@ts-ignore
      window.removeEventListener('employeeUpdated', async () => await refetch(queryParams));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <ModelList>
      <ModelListHeader title="Employees">
        <span className={employeeListStyles.span}>
          <DynamicSortOptions
            label="Sort By:"
            name="sortBy"
            sortOptions={employeeSortOptions}
            onSortChange={handleQueryParamChange}
            currentSort={queryParams.sortBy as string}
            title="Sort the employees by the selected option."
          />

          <DynamicSortOptions
            label="Limit:"
            name="limit"
            sortOptions={employeeLimitOptions}
            onSortChange={handleQueryParamChange}
            currentSort={String(queryParams.limit ?? 5)}
            title="Limit the number of employees displayed."
          />
        </span>

        <button
          type="button"
          className={employeeListStyles.addEmployeeBtn}
          onClick={handleAddEmployeeClick}>
          + Add Employee
        </button>
      </ModelListHeader>

      <PaginationContainer
        data={employees}
        RenderList={RenderList}
        queryParams={queryParams}
        setQueryParams={setQueryParams}
      />
    </ModelList>
  );
}
