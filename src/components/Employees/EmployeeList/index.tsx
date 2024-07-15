import {
  EmployeeSortBy,
  employeeListStyles,
  employeeSortOptions,
  employeeLimitOptions
} from './data';
import {useEffect, useState} from 'react';
import {ListHeader} from './ListHeader';
import {ListsContainer} from './ListContainer';
import {useEmployeeData} from '../../../hooks';
import {DynamicSortOptions} from '../../Forms';
import {ModalAction, ModalType} from '../../ Modal';
import {EmployeeListItem} from '../EmployeeListItem';
import {PaginationContainer} from '../../Pagination/Container';
import {EmployeeWithAssociations} from '../../../lib/db/controller/Employee';
import {PaginationQueryParams} from '../../../lib/db/controller/Employee/helpers';

function RenderList({data}: {data: EmployeeWithAssociations[]}) {
  return data?.map((employee: EmployeeWithAssociations) => (
    <EmployeeListItem key={employee.id} employee={employee} />
  ));
}

export const defaultEmployeesQueryParams: PaginationQueryParams<EmployeeSortBy> = {
  limit: '5',
  offset: '0',
  sortBy: 'name'
};

export function EmployeeList() {
  const [queryParams, setQueryParams] = useState<PaginationQueryParams<EmployeeSortBy>>(
    defaultEmployeesQueryParams
  );
  const {employees, refetch} = useEmployeeData(queryParams);

  const handleQueryParamChange = (event: React.ChangeEvent<HTMLSelectElement>): void => {
    const {name, value} = event.target;
    const currentQueryParams = {...queryParams, [name]: value};

    setQueryParams(currentQueryParams);
  };

  const handleAddEmployeeClick = (e: React.SyntheticEvent) => {
    e.preventDefault();
    e.stopPropagation();

    window.dispatchEvent(
      new CustomEvent('modalEvent', {
        detail: {action: ModalAction.OPEN, type: ModalType.ADD_EMPLOYEE, payload: null}
      })
    );
  };

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
    <ListsContainer>
      <ListHeader title="Employees">
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
      </ListHeader>

      <PaginationContainer
        data={employees}
        RenderList={RenderList}
        setQueryParams={setQueryParams}
        queryParams={queryParams}
      />
    </ListsContainer>
  );
}
