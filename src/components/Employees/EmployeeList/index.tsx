import {
  EmployeeSortBy,
  employeeListStyles,
  employeeSortOptions,
  employeeLimitOptions
} from './data';
import {useState} from 'react';
import {ListHeader} from './ListHeader';
import {ListsContainer} from './ListContainer';
import {useEmployeeData} from '../../../hooks';
import {SortableFilterOption} from '../../Forms';
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
  const {employees} = useEmployeeData(queryParams);

  const handleQueryParamChange = (event: React.ChangeEvent<HTMLSelectElement>): void => {
    const {name, value} = event.target;
    const currentQueryParams = {...queryParams, [name]: value};

    setQueryParams(currentQueryParams);
  };

  return (
    <ListsContainer>
      <ListHeader title="Employees">
        <span className={employeeListStyles.span}>
          <SortableFilterOption
            label="Sort By:"
            name="sortBy"
            sortOptions={employeeSortOptions}
            onSortChange={handleQueryParamChange}
            currentSort={queryParams.sortBy as string}
            title="Sort the employees by the selected option."
          />

          <SortableFilterOption
            label="Limit:"
            name="limit"
            sortOptions={employeeLimitOptions}
            onSortChange={handleQueryParamChange}
            currentSort={String(queryParams.limit ?? 5)}
            title="Limit the number of employees displayed."
          />
        </span>

        <button type="button" className={employeeListStyles.addEmployeeBtn}>
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
