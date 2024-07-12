import {useEffect, useState} from 'react';
import {useEmployeeData} from '../../../hooks';
import {EmployeeListItem} from '../EmployeeListItem';
import {EmployeeWithAssociations} from '../../../lib/db/controller/Employee';
import {PaginationQueryParams} from '../../../lib/db/controller/Employee/helpers';

const styles = {
  label: 'text-gray-300',
  sortableOption: 'flex items-center space-x-4',
  h1: 'w-auto text-xl font-semibold whitespace-nowrap',
  select: 'px-2 py-1  bg-slate-900 text-gray-100 rounded-md',
  span: 'w-full flex flex-wrap flex-row gap-4 justify-center items-center',
  div: 'w-full flex flex-col md:flex-row justify-center items-center gap-4  bg-gray-800 p-2 rounded-md mt-6',
  addEmployeeBtn: `px-4 py-2 bg-[var(--green)] flex flex-row flex-wrap text-center items-center hover:bg-black 
  text-white rounded-md text-sm w-26 md:w-auto  md:whitespace-nowrap md:text-base absolute top-[51px] right-1
   md:relative md:top-0 md:right-0`
};

export type EmployeeSortBy = 'name' | 'isAdmin' | 'isSupervisor' | 'isEmployee';

export const employeeLimitOptions = [
  {
    value: '5',
    text: '5'
  },
  {
    value: '10',
    text: '10'
  },
  {
    value: '15',
    text: '15'
  },
  {
    value: '20',
    text: '20'
  },
  {
    value: '25',
    text: '25'
  },
  {
    value: '50',
    text: '50'
  },
  {
    value: '100',
    text: '100'
  },
  {
    value: '-1',
    text: 'All'
  }
];

export const employeeSortOptions = [
  {
    value: 'name',
    text: 'Name'
  },
  {
    value: 'isAdmin',
    text: 'Is Admin'
  },
  {
    value: 'isSupervisor',
    text: 'Is Supervisor'
  },
  {
    value: 'isEmployee',
    text: 'Employees'
  }
];

function SortableOption({
  label,
  title,
  name,
  currentSort,
  sortOptions,
  onSortChange
}: {
  label: string;
  title: string;
  name: string;
  currentSort: string;
  sortOptions: {value: string; text: string}[];
  onSortChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
}) {
  return (
    <div className={styles.sortableOption}>
      <label className={styles.label}>{label}</label>
      <select
        title={title}
        className={styles.select}
        name={name}
        onChange={onSortChange}
        value={currentSort}>
        {sortOptions.map((option, index) => (
          <option key={index} value={option.value}>
            {option.text}
          </option>
        ))}
      </select>{' '}
    </div>
  );
}

export const defaultEmployeesQueryParams: PaginationQueryParams<EmployeeSortBy> = {
  limit: '10',
  offset: '0',
  sortBy: 'name'
};
export function EmployeeList() {
  const [offset, setOffset] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [numberOfPages, setNumberOfPages] = useState<number>(1);
  const [queryParams, setQueryParams] = useState<PaginationQueryParams<EmployeeSortBy>>(
    defaultEmployeesQueryParams
  );
  const {employees} = useEmployeeData(queryParams);

  const handleQueryParamChange = (event: React.ChangeEvent<HTMLSelectElement>): void => {
    const {name, value} = event.target;
    const currentQueryParams = {...queryParams, [name]: value};

    setQueryParams(currentQueryParams);
  };

  const handlePageIncrement = (e: React.SyntheticEvent): void => {
    e.preventDefault();
    e.stopPropagation();

    if (currentPage === numberOfPages) return;

    const newOffset = offset + (Number(queryParams.limit) as number);

    const currentQueryParams = {...queryParams, offset: String(newOffset)};
    setOffset(newOffset);
    setCurrentPage(currentPage + 1);
    setQueryParams(currentQueryParams);
  };

  const handlePageDecrement = (e: React.SyntheticEvent): void => {
    e.preventDefault();
    e.stopPropagation();

    if (currentPage === 1) return;

    const newOffset = offset - (Number(queryParams.limit) as number);
    const currentQueryParams = {...queryParams, offset: String(newOffset)};

    setOffset(newOffset);
    setCurrentPage(currentPage + 1);
    setQueryParams(currentQueryParams);
  };

  useEffect(() => {
    if (employees) {
      const {numRecords, limit} = employees;
      const numPages = Math.ceil(numRecords / Number(limit));
      const _currentPage = Math.ceil(offset / Number(limit)) + 1;
      const _offset = limit * (_currentPage - 1);

      setOffset(_offset);
      setNumberOfPages(numPages);
      setCurrentPage(_currentPage);
    }

    //eslint-disable-next-line
  }, [employees]);

  return (
    <>
      <div className={styles.div}>
        <h1 className={styles.h1}>Employee List</h1>

        <span className={styles.span}>
          <SortableOption
            label="Sort By:"
            name="sortBy"
            sortOptions={employeeSortOptions}
            onSortChange={handleQueryParamChange}
            currentSort={queryParams.sortBy as string}
            title="Sort the employees by the selected option."
          />

          <SortableOption
            label="Limit:"
            name="limit"
            sortOptions={employeeLimitOptions}
            onSortChange={handleQueryParamChange}
            currentSort={String(queryParams.limit ?? 10)}
            title="Limit the number of employees displayed."
          />
        </span>

        <button type="button" className={styles.addEmployeeBtn}>
          Add Employee
        </button>
      </div>

      <div className="w-full h-full flex flex-col gap-4 mt-4">
        <div className="w-full h-auto  flex flex-wrap flex-row justify-between items-center">
          <p className="text-gray-300">
            Showing {offset + 1} to {offset + Number(queryParams.limit)} of {employees?.numRecords}{' '}
            records
          </p>

          <p className="text-gray-300">
            Page {currentPage} of {numberOfPages}
          </p>

          <div className="w-auto flex flex-row justify-between items-center gap-8">
            <button
              type="button"
              disabled={currentPage === 1}
              className="p-3 bg-gray-800 rounded-md text-xs hover:bg-gray-700"
              onClick={handlePageDecrement}>
              Previous
            </button>
            <button
              type="button"
              onClick={handlePageIncrement}
              className="p-3 bg-gray-800 rounded-md text-xs hover:bg-gray-700">
              Next
            </button>
          </div>
        </div>
        {employees?.data?.map((employee: EmployeeWithAssociations) => (
          <EmployeeListItem key={employee.id} employee={employee} />
        ))}

        <div className="w-full h-auto  flex flex-wrap flex-row justify-between items-center">
          <button
            type="button"
            disabled={currentPage === 1}
            className="p-3 bg-gray-800 rounded-md text-xs hover:bg-gray-700"
            onClick={handlePageDecrement}>
            Previous
          </button>

          <p className="text-gray-300">
            Page {currentPage} of {numberOfPages}
          </p>

          <button
            type="button"
            onClick={handlePageIncrement}
            className="p-3 bg-gray-800 rounded-md text-xs hover:bg-gray-700">
            Next
          </button>
        </div>
      </div>
    </>
  );
}
