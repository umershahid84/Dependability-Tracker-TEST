import {
  DivisionAttributes,
  LeaveTypeAttributes,
  EmployeeWithAssociations,
  SupervisorWithAssociations
} from '../../../lib/db/models/types';
import {FormLabel} from '../FormLabel';
import {useEffect, useState} from 'react';
import {FormLabelContainer} from '../EmployeeModal/FormLayout';
import {dbSearchParams} from '../../CallOuts/CallOutsList/helpers';
import {RangeOptions, RangeOptionsVariant} from './AdvancedSearchOptions';
import {CallOutAdvancedSearchContext, useCallOutAdvancedSearchContext} from '../../../providers';

const styles = {
  h2: 'text-2xl font-bold mb-4 text-center mt-2',
  form: 'grid grid-cols-2 gap-y-4 gap-x-12 w-full p-3',

  input: 'border p-2 rounded-md w-full bg-slate-800 text-gray-300',
  inputWithMargin: 'mr-2 h-4 w-4  border-gray-300 rounded bg-slate-800',
  buttonContainer: 'w-full flex flex-col justify-center items-center mt-6 gap-4',
  submitButton: 'bg-blue-500 text-white rounded-md py-2 px-4 hover:bg-blue-600 w-full h-10',
  clearButton: 'bg-red-600 text-white rounded-md py-2 px-4 hover:bg-red-700 w-full h-10'
};

export function CallOutsAdvancedSearch() {
  const [clearRanges, setClearRanges] = useState<boolean>(false);

  const {
    divisions,
    employees,
    leaveTypes,
    supervisors,
    searchParams,
    setSearchParams,
    setExecuteSearch,
    handleSearchParamsChange
  }: CallOutAdvancedSearchContext = useCallOutAdvancedSearchContext();

  const onSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setExecuteSearch(true);
  };

  const clearForm = (e: React.SyntheticEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setClearRanges(true);
    setSearchParams({...dbSearchParams});
    setExecuteSearch(true);
  };

  useEffect(() => {
    if (clearRanges) {
      setClearRanges(false);
    }
  }, [clearRanges]);

  const hasParams = Object.values(searchParams).some(value => value !== undefined);

  return (
    <>
      <h2 className={styles.h2}>Advanced Search Options</h2>
      <form className={styles.form} onSubmit={e => e.preventDefault()}>
        <FormLabelContainer>
          <FormLabel label="Divisions" htmlFor="division_id" />
          <select
            name="division_id"
            title="Division"
            value={searchParams.employee_id ?? ''}
            onChange={handleSearchParamsChange}
            className={styles.input}>
            <option value="">Select Division</option>
            <option value="">Any</option>
            {divisions?.map((division: DivisionAttributes) => (
              <option key={division.id} value={division.id}>
                {division.name}
              </option>
            ))}
          </select>
        </FormLabelContainer>

        <FormLabelContainer>
          <FormLabel label="Employee Name" htmlFor="employee_id" />
          <select
            name="employee_id"
            title="Employee Name"
            value={searchParams.employee_id ?? ''}
            onChange={handleSearchParamsChange}
            className={styles.input}>
            <option value="">Select Employee</option>
            <option value="">Any</option>
            {employees?.map((employee: EmployeeWithAssociations) => (
              <option key={employee.id} value={employee.id}>
                {employee.name}
              </option>
            ))}
          </select>
        </FormLabelContainer>

        <FormLabelContainer>
          <FormLabel label="Leave Type" htmlFor="leave_type_id" />
          <select
            name="leave_type_id"
            title="Leave Type"
            value={searchParams.leave_type_id ?? ''}
            onChange={handleSearchParamsChange}
            className={styles.input}>
            <option value="">Select Leave Type</option>
            <option value="">Any</option>
            {leaveTypes?.map((leaveType: LeaveTypeAttributes) => (
              <option key={leaveType.id} value={leaveType.id}>
                {leaveType.reason}
              </option>
            ))}
          </select>
        </FormLabelContainer>

        <FormLabelContainer>
          <FormLabel label="Supervisor Name" htmlFor="supervisor_id" />
          <select
            name="supervisor_id"
            title="Supervisor Name"
            value={searchParams.supervisor_id ?? ''}
            onChange={handleSearchParamsChange}
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
          <RangeOptions key={variant} variant={variant} clearRangeOptions={clearRanges} />
        ))}
      </form>
      <div className={styles.buttonContainer}>
        <button type="button" className={styles.submitButton} onClick={onSubmit}>
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
