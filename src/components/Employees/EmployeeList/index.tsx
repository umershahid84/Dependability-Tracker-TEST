import {
  EmployeeSortBy,
  employeeListStyles,
  employeeSortOptions,
  employeeLimitOptions
} from './data';
import { useEffect } from 'react';
import {
  ModelWithPagination,
  PaginationQueryParams,
  EmployeeWithAssociations
} from '../../../lib/db/controller';
import { ClientAPI } from '../../../client-api';
import { DynamicSortOptions } from '../../Forms';
import { ModalAction, ModalType } from '../../Modal';
import { EmployeeListItem } from '../EmployeeListItem';
import { ModelList, ModelListHeader } from '../../ModelList';
import { PaginationContainer } from '../../Pagination/Container';
import { UseGetEmployees, useGetEmployees, UseQueryParams, useQueryParams } from '../../../hooks';

import { SupervisorWithAssociations } from '../../../lib/db/models/Supervisor';

function RenderList({
  data,
  onModalDeleteCallBack,
  onModalEditCallBack
}: {
  data: EmployeeWithAssociations[];
  onModalDeleteCallBack?: (employeeId: string) => void;
  onModalEditCallBack?: (employee: EmployeeWithAssociations) => void;
}): JSX.Element[] {
  return data?.map((employee: EmployeeWithAssociations) => (
    <EmployeeListItem
      key={employee.id}
      employee={employee}
      onModalEditCallBack={onModalEditCallBack}
      onModalDeleteCallBack={onModalDeleteCallBack}
    />
  ));
}

export const defaultEmployeesQueryParams: PaginationQueryParams<EmployeeSortBy> = {
  limit: '5',
  offset: '0',
  sortBy: 'name'
};

export function EmployeeList() {
  const { queryParams, setQueryParams, handleQueryParamChange }: UseQueryParams<EmployeeSortBy> =
    useQueryParams<EmployeeSortBy>(defaultEmployeesQueryParams);
  const { employees, setEmployees, refetch }: UseGetEmployees = useGetEmployees(queryParams);

  const onModalEditCallBack = (employee: EmployeeWithAssociations, isNew = false) => {
    (async () => {
      const { data } =
        (await ClientAPI.Supervisors.Read()) as ModelWithPagination<SupervisorWithAssociations>;

      let roles: string[] = [];

      if (
        data?.some(
          supervisor => supervisor.supervisor_info.id === employee.id && supervisor.is_admin
        )
      ) {
        roles.push('Admin');
        roles.push('Supervisor');
      } else if (
        data?.some(
          supervisor => supervisor.supervisor_info.id === employee.id && !supervisor.is_admin
        )
      ) {
        roles.push('Supervisor');
      } else {
        roles.push('Employee');
      }
      if (!isNew) {
        const updatedEmployees: EmployeeWithAssociations[] =
          employees?.data.map(currentEmployee => {
            if (currentEmployee.id === employee.id) {
              return { ...employee, role: roles.join(', ') };
            }
            return currentEmployee;
          }) ?? [];

        setEmployees({
          ...(employees as ModelWithPagination<EmployeeWithAssociations>),
          data: updatedEmployees
        });
      } else {
        setEmployees({
          ...(employees as ModelWithPagination<EmployeeWithAssociations>),
          data: [{ ...employee, role: roles.join(', ') }, ...(employees?.data ?? [])]
        });
      }
    })();
  };

  const onModalDeleteCallBack = (employeeId: string) => {
    const updatedEmployees: EmployeeWithAssociations[] =
      employees?.data.filter(currentEmployee => currentEmployee.id !== employeeId) ?? [];

    setEmployees({
      ...(employees as ModelWithPagination<EmployeeWithAssociations>),
      data: updatedEmployees
    });
  };

  const handleAddEmployeeClick = (e: React.SyntheticEvent) => {
    e.preventDefault();
    e.stopPropagation();

    window.dispatchEvent(
      new CustomEvent('modalEvent', {
        detail: {
          action: ModalAction.OPEN,
          type: ModalType.ADD_EMPLOYEE,
          payload: { onModalEditCallBack }
        }
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
        queryParams={queryParams}
        RenderList={RenderList as any}
        setQueryParams={setQueryParams}
        onModalEditCallBack={onModalEditCallBack}
        onModalDeleteCallBack={onModalDeleteCallBack}
      />
    </ModelList>
  );
}
