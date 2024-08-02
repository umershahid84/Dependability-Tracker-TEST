import { useEffect, useState } from 'react';
import { ModalAction } from '../../../Modal';
import {
  EmployeeWithAssociations,
  SupervisorWithAssociations
} from '../../../../lib/db/models/types';
import { FormLabel } from '../../FormInputs/FormLabel';
import { RangeOptions } from '../../FormInputs/RangeOptions';
import { SelectDivision } from '../../FormInputs/SelectDivision';
import {
  UseRangeOptionsStateMap,
  useRangeOptionsStateMap
} from '../../FormInputs/RangeOptions/useRangeOptionsVariantMap';
import { FormLabelContainer } from '../../EmployeeModal/FormLayout';
import { dbSearchParams } from '../../../CallOuts/CallOutsList/helpers';
import { RangeOptionsVariant } from '../../FormInputs/RangeOptions/data';
import { SelectEmployeeName } from '../../FormInputs/SelectEmployeeName';
import { SelectLeaveTypeReason } from '../../FormInputs/SelectLeaveType';
import type { GetAllCallOutOptions } from '../../../../lib/db/controller/Callout/helpers';
import { CallOutAdvancedSearchContext, useCallOutAdvancedSearchContext } from '../../../../providers';

const styles = {
  h2: 'text-2xl font-bold mb-4 text-center mt-2',
  form: 'grid grid-cols-2 gap-y-4 gap-x-12 w-full p-3',
  input: 'border p-2 rounded-md w-full bg-tertiary text-primary',
  inputWithMargin: 'mr-2 h-4 w-4  border-gray-300 rounded bg-tertiary',
  buttonContainer:
    'w-full flex flex-col justify-center items-center mt-6 gap-4 transition-all  duration-300',
  clearButton: `border-2 border-gray-300 text-primary hover:border-red-600 rounded-md py-2 px-4
     hover:bg-red-700 w-[95%] hover:w-[98%] h-10 `,
  submitButton: `border-2 border-[var(--green)] text-accent hover:text-primary rounded-md rounded-md
     py-2 px-4 hover:bg-accent-primary w-[95%] hover:w-[98%] Text-outline-hover h-10`
};

export function CallOutsAdvancedSearch() {
  const [clearRanges, setClearRanges] = useState<boolean>(false);
  const stateOptionsVariantMap: UseRangeOptionsStateMap = useRangeOptionsStateMap();
  const {
    divisions,
    employees,
    leaveTypes,
    supervisors,
    searchParams,
    setSearchParams,
    setExecuteSearch
  }: CallOutAdvancedSearchContext = useCallOutAdvancedSearchContext();
  const [employeesData, setEmployeesData] = useState<EmployeeWithAssociations[]>(employees);
  const [searchParamsCopy, setSearchParamsCopy] = useState<GetAllCallOutOptions>({
    ...searchParams
  });

  const copyHasParams = Object.values(searchParamsCopy).some(value => value !== undefined);
  const searchParamsHasParams = Object.values(searchParams).some(value => value !== undefined);
  const hasParams = copyHasParams || searchParamsHasParams;

  const onSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (copyHasParams) {
      setSearchParams({ ...searchParamsCopy });
      setExecuteSearch(true);
      setTimeout(() => {
        window.dispatchEvent(new CustomEvent('modalEvent', { detail: { action: ModalAction.CLOSE } }));
      }, 200);
    }
  };

  const clearForm = (e: React.SyntheticEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (copyHasParams) {
      setClearRanges(true);
      setSearchParamsCopy({ ...dbSearchParams });
    }

    if (searchParamsHasParams) {
      setClearRanges(true);
      setSearchParams({ ...dbSearchParams });
      setExecuteSearch(true);
    }
  };

  const handleSearchParamsCopyChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setSearchParamsCopy({
      ...searchParamsCopy,
      [e.target.name]: e.target.value === '' ? undefined : e.target.value
    });
  };

  useEffect(() => {
    if (clearRanges) {
      setClearRanges(false);
    }
  }, [clearRanges]);

  useEffect(() => {
    setEmployeesData(employees ?? []);
  }, [employees]);

  useEffect(() => {
    let filteredEmployees: EmployeeWithAssociations[] = [];

    const supervisorEmployeeIds = supervisors?.map(supervisor => supervisor.supervisor_info.id);

    // if the division search param is set, filter the employees by the selected division
    // and exclude supervisors
    if (searchParamsCopy.division_id) {
      filteredEmployees =
        employees?.filter(
          (employee: EmployeeWithAssociations) =>
            employee.divisions.some(
              division =>
                division.id === searchParamsCopy.division_id &&
                !supervisorEmployeeIds?.includes(employee.id)
            ) ?? []
        ) ?? [];
    } else {
      // if not just return non-supervisor employees
      filteredEmployees =
        employees?.filter((employee: EmployeeWithAssociations) => {
          return !supervisorEmployeeIds?.includes(employee.id);
        }) ?? [];
    }
    setEmployeesData(filteredEmployees ?? []);
  }, [searchParamsCopy.division_id, supervisors, employees]);

  return (
    <>
      <h2 className={styles.h2}>Advanced Search Options</h2>
      <form className={styles.form} onSubmit={e => e.preventDefault()}>
        <SelectDivision
          divisions={divisions}
          value={searchParamsCopy.division_id ?? ''}
          onChangeHandler={handleSearchParamsCopyChange}
        />

        <SelectEmployeeName
          name="employee_id"
          title="Employee Name"
          employees={employeesData}
          className={styles.input}
          onChangeHandler={handleSearchParamsCopyChange}
          employeeName={searchParamsCopy.employee_id as string}
        />

        <SelectLeaveTypeReason
          title="Leave Type"
          name="leave_type_id"
          className={styles.input}
          leaveTypes={leaveTypes}
          onChangeHandler={handleSearchParamsCopyChange}
          leaveType={(searchParamsCopy.leave_type_id as string) ?? ''}
        />

        <FormLabelContainer>
          <FormLabel label="Supervisor Name" htmlFor="supervisor_id" />
          <select
            name="supervisor_id"
            title="Supervisor Name"
            value={searchParamsCopy.supervisor_id ?? ''}
            onChange={handleSearchParamsCopyChange}
            className={styles.input}>
            <option value="">Select Supervisor</option>
            <option value="">Any</option>
            {supervisors?.map((supervisor: SupervisorWithAssociations) => (
              <option key={supervisor.id} value={supervisor.id}>
                {supervisor.supervisor_info.name}
              </option>
            ))}
          </select>
        </FormLabelContainer>

        {Object.values(RangeOptionsVariant).map((variant: RangeOptionsVariant) => (
          <RangeOptions
            key={variant}
            variant={variant}
            clearRangeOptions={clearRanges}
            searchParams={searchParamsCopy}
            setSearchParams={setSearchParamsCopy}
            stateOptionsVariantMap={stateOptionsVariantMap}
            handleSearchParamsChange={handleSearchParamsCopyChange}
          />
        ))}
      </form>
      <div className={styles.buttonContainer}>
        <button
          type="button"
          disabled={!copyHasParams}
          className={
            styles.submitButton + ' ' + (copyHasParams ? '' : 'opacity-50 cursor-not-allowed')
          }
          onClick={onSubmit}>
          Search
        </button>

        {/* only display the button if a search param has been provided */}
        {hasParams && (
          <button type="button" className={styles.clearButton} onClick={clearForm}>
            Clear
          </button>
        )}
      </div>
    </>
  );
}
