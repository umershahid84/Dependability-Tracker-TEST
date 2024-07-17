import {
  LeaveTypeAttributes,
  EmployeeWithAssociations,
  SupervisorWithAssociations
} from '../../../lib/db/models/types';
import {FormLabel} from '../FormLabel';
import {ModalAction} from '../../ Modal';
import {useEffect, useState} from 'react';
import {useIsMounted} from '../../../hooks';
import {
  useDbSearchParamsFormState,
  UseDbSearchParamsFormState
} from '../../CallOuts/CallOutsList/helpers';
import {ApiData} from '../../../lib/apiController';
import {FormLabelContainer} from '../EmployeeModal/FormLayout';
import {LeftEarlyOptions} from './AdvancedSearchOptions/LeftEarlyOptions';
import {ArrivedLateOptions} from './AdvancedSearchOptions/ArrivedLateOptions';
import {TimeRangeOptions, TimeRangeOptionsVariants} from './AdvancedSearchOptions';
import {DateRangeOptions, DateRangeOptionsVariants} from './AdvancedSearchOptions/DateRangeOptions';

const styles = {
  h2: 'text-2xl font-bold mb-4 text-center mt-2',
  form: 'grid grid-cols-2 gap-y-4 gap-x-12 w-full p-3',
  buttonContainer: 'w-full flex flex-col justify-center items-center mt-6',
  input: 'border p-2 rounded-md w-full bg-slate-800 text-gray-300',
  inputWithMargin: 'mr-2 h-4 w-4  border-gray-300 rounded bg-slate-800',
  button: 'bg-blue-500 text-white rounded-md py-2 px-4 hover:bg-blue-600 w-full h-10'
};

export type CallOutsAdvancedSearchProps = {
  leaveTypes: LeaveTypeAttributes[];
  employees: EmployeeWithAssociations[];
  dbSearchParamsFormState: UseDbSearchParamsFormState;
};

const getAllSupervisors = async (): Promise<SupervisorWithAssociations[]> => {
  const response = await fetch('/api/admin/supervisors');
  const data: ApiData<SupervisorWithAssociations[]> = await response.json();
  return data?.data ?? [];
};

export function CallOutsAdvancedSearch({
  employees,
  leaveTypes,
  dbSearchParamsFormState
}: Readonly<CallOutsAdvancedSearchProps>) {
  const isMounted: boolean = useIsMounted();
  const [supervisors, setSupervisors] = useState<SupervisorWithAssociations[]>([]);

  const {searchParams, setSearchParams, handleSearchParamsChange}: UseDbSearchParamsFormState =
    useDbSearchParamsFormState();

  const onSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault();
    e.stopPropagation();

    dbSearchParamsFormState.setSearchParams(searchParams);
    window.dispatchEvent(new CustomEvent('modalEvent', {detail: {action: ModalAction.CLOSE}}));
  };

  useEffect(() => {
    if (isMounted) {
      getAllSupervisors().then(setSupervisors);
    }
  }, [isMounted]);

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

        <DateRangeOptions
          dbSearchParamsFormState={{searchParams, setSearchParams, handleSearchParamsChange}}
          variant={DateRangeOptionsVariants.CALL_DATE}
        />

        <DateRangeOptions
          dbSearchParamsFormState={{searchParams, setSearchParams, handleSearchParamsChange}}
          variant={DateRangeOptionsVariants.SHIFT_DATE}
        />

        <TimeRangeOptions
          dbSearchParamsFormState={{searchParams, setSearchParams, handleSearchParamsChange}}
          variant={TimeRangeOptionsVariants.CALL_TIME}
        />

        <TimeRangeOptions
          dbSearchParamsFormState={{searchParams, setSearchParams, handleSearchParamsChange}}
          variant={TimeRangeOptionsVariants.SHIFT_TIME}
        />

        <LeftEarlyOptions
          dbSearchParamsFormState={{searchParams, setSearchParams, handleSearchParamsChange}}
        />

        <ArrivedLateOptions
          dbSearchParamsFormState={{searchParams, setSearchParams, handleSearchParamsChange}}
        />
      </form>
      <div className={styles.buttonContainer}>
        <button type="button" className={styles.button} onClick={onSubmit}>
          Search
        </button>
      </div>
    </>
  );
}
