import React from 'react';
import {FormLabel} from '../FormInputs/FormLabel';
import {EmployeeFormData} from '../../../client-api/employees';
import {DynamicOptions, DynamicOption} from '../FormInputs/DynamicOptions';
import {DivisionAttributes} from '../../../lib/db/models/Division';
import {shuttleNumberOptions} from '../../../lib/utils/shared/shuttleNumbers';

const styles = {
  h2: 'text-2xl font-bold mb-4',
  form: 'grid grid-cols-1 gap-4 w-full',
  buttonContainer: 'w-full flex justify-end',
  input: 'border p-2 rounded-md w-full bg-tertiary',
  inputWithMargin: 'mr-2 h-4 w-4  border-gray-300 rounded bg-tertiary',
  button: 'bg-blue-600 text-primary rounded-md py-2 px-4 hover:bg-blue-500'
};

export function FormLabelContainer({
  children,
  addClasses
}: Readonly<{children: React.ReactNode; addClasses?: string}>): React.ReactElement {
  return (
    <div className={'w-full flex flex-col justify-start items-start' + ' ' + (addClasses ?? '')}>
      {children}
    </div>
  );
}

function RadioDivider({children}: Readonly<{children: React.ReactNode}>): React.ReactElement {
  return <div className="flex items-center space-x-4">{children}</div>;
}

export type EmployeeCrudFormModalLayoutProps = {
  title?: string;
  formData: EmployeeFormData;
  divisions: DivisionAttributes[];
  divisionOptions: DynamicOption['dynamicOptions'];
  onSubmit: (e: React.SyntheticEvent) => Promise<void>;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => void;
};

export function EmployeeCrudFromModalLayout({
  title,
  formData,
  onChange,
  onSubmit,
  divisions,
  divisionOptions
}: Readonly<EmployeeCrudFormModalLayoutProps>): React.ReactElement {
  const employeeParkingDivisionId = divisions.find(d => d.name === 'Employee Parking')?.id;
  const selectedDivisionIds = formData.division ? formData.division.split(',') : [];
  const showShuttleNumber = Boolean(
    employeeParkingDivisionId && selectedDivisionIds.includes(employeeParkingDivisionId)
  );

  return (
    <>
      <h2 className={styles.h2}>{title}</h2>
      <form className={styles.form} onSubmit={e => e.preventDefault()}>
        <FormLabelContainer>
          <FormLabel label="Employee Name" htmlFor="name" />
          <input
            required
            type="text"
            name="name"
            title="Employee Name"
            value={formData.name}
            onChange={onChange}
            className={styles.input}
          />
        </FormLabelContainer>

        <FormLabelContainer>
          <FormLabel label="Assign Employee Division:" htmlFor="division" />
          <select
            required
            name="division"
            title="Add Divisions"
            className={styles.input}
            value={formData.division}
            onChange={onChange}>
            <option value="" disabled>
              Assign Employee Division(s)
            </option>
            <DynamicOptions dynamicOptions={divisionOptions} />
            <option value={divisions.map(el => el.id).join(',')}>Assign All</option>
          </select>
        </FormLabelContainer>

        {showShuttleNumber && (
          <FormLabelContainer>
            <FormLabel label="Shuttle Number" htmlFor="shuttleNumber" />
            <select
              name="shuttleNumber"
              title="Shuttle Number"
              className={styles.input}
              value={formData.shuttleNumber}
              onChange={onChange}>
              <option value="">Unassigned</option>
              {shuttleNumberOptions.map(option => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </FormLabelContainer>
        )}

        <FormLabelContainer>
          <FormLabel label="Admin?" htmlFor="isAdmin" />
          <RadioDivider>
            <FormLabel label="Yes" htmlFor="isAdmin" />
            {/* <label className="flex items-center"> */}
            <input
              value="1"
              type="radio"
              name="isAdmin"
              title="isAdmin"
              onChange={onChange}
              checked={formData.isAdmin === '1'}
              className={styles.inputWithMargin}
            />

            {/* </label> */}
            <FormLabel label="No" htmlFor="isAdmin" />
            <input
              value="0"
              type="radio"
              name="isAdmin"
              title="isAdmin"
              onChange={onChange}
              checked={formData.isAdmin === '0'}
              className={styles.inputWithMargin}
            />
          </RadioDivider>
        </FormLabelContainer>
        <FormLabelContainer>
          <FormLabel label="Supervisor?" htmlFor="isSupervisor" />
          <RadioDivider>
            <FormLabel label="Yes" htmlFor="isSupervisor" />
            <input
              value="1"
              type="radio"
              name="isSupervisor"
              title="isSupervisor"
              onChange={onChange}
              checked={formData.isSupervisor === '1'}
              className={styles.inputWithMargin}
            />

            <FormLabel label="No" htmlFor="isSupervisor" />
            <input
              value="0"
              type="radio"
              name="isSupervisor"
              title="isSupervisor"
              onChange={onChange}
              checked={formData.isSupervisor === '0'}
              className={styles.inputWithMargin}
            />
          </RadioDivider>
        </FormLabelContainer>

        <FormLabelContainer>
          <FormLabel label="Shift Start Time" htmlFor="shiftStartTime" />
          <input
            required
            type="time"
            name="shiftStartTime"
            title="Shift Start Time"
            value={formData.shiftStartTime}
            onChange={onChange}
            className={styles.input}
          />
        </FormLabelContainer>

        <FormLabelContainer>
          <FormLabel label="Shift End Time" htmlFor="shiftEndTime" />
          <input
            required
            type="time"
            name="shiftEndTime"
            title="Shift End Time"
            value={formData.shiftEndTime}
            onChange={onChange}
            className={styles.input}
          />
        </FormLabelContainer>

        <FormLabelContainer>
          <FormLabel label="Days Off" htmlFor="daysOff" />
          <div className="flex flex-wrap gap-3 mt-1">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, index) => {
              const selectedDays = formData.daysOff
                ? formData.daysOff.split(',').map(d => d.trim()).filter(Boolean).map(Number)
                : [];
              const isChecked = selectedDays.includes(index);
              return (
                <label key={day} className="flex items-center gap-1 cursor-pointer text-sm">
                  <input
                    type="checkbox"
                    name="daysOff"
                    value={String(index)}
                    checked={isChecked}
                    onChange={e => {
                      const current = formData.daysOff
                        ? formData.daysOff.split(',').map(d => d.trim()).filter(Boolean).map(Number)
                        : [];
                      const updated = e.target.checked
                        ? [...current, index]
                        : current.filter(d => d !== index);
                      onChange({
                        target: {name: 'daysOff', value: updated.sort().join(',')}
                      } as React.ChangeEvent<HTMLInputElement>);
                    }}
                    className="h-4 w-4 border-gray-300 rounded bg-tertiary"
                  />
                  {day}
                </label>
              );
            })}
          </div>
        </FormLabelContainer>

        <FormLabelContainer>
          <FormLabel label="Employee Status" htmlFor="employeeStatus" />
          <select
            required
            name="employeeStatus"
            title="Employee Status"
            className={styles.input}
            value={formData.employeeStatus}
            onChange={onChange}>
            <option value="FULL_TIME">Full-Time</option>
            <option value="PART_TIME">Part-Time</option>
          </select>
        </FormLabelContainer>

        <div className={styles.buttonContainer}>
          <button type="button" className={styles.button} onClick={onSubmit}>
            Submit
          </button>
        </div>
      </form>
    </>
  );
}

export default EmployeeCrudFromModalLayout;
