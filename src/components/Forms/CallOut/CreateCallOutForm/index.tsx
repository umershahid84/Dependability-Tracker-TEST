import React, {useEffect, useState} from 'react';
import {
  LeaveTypeAttributes,
  CallOutWithAssociations,
  EmployeeWithAssociations
} from '../../../../lib/db/models/types';
import { TextArea } from '../../FormInputs/TextArea';
import { DateInput } from '../../FormInputs/DateInput';
import { TimeInput } from '../../FormInputs/TimeInput';
import { trim } from '../../../../lib/utils/shared/strings';
import { SelectEmployeeName } from '../../FormInputs/SelectEmployeeName';
import { DisabledTextInput } from '../../FormInputs/DisabledTextInput';
import { LeftEarlyWithRange } from '../../FormInputs/LeftEarlyWithRange';
import { SelectLeaveTypeReason } from '../../FormInputs/SelectLeaveType';
import { ArrivedLateWithRange } from '../../FormInputs/ArrivedLateWithRange';
import { CallOutFormActionButtons } from '../../FormInputs/CallOutFormActionButtons';
import { UseCreateCallOutFormState, useCreateCallOutFormState } from '../../../../hooks';
import {EmployeeScheduleCalendar} from '../../../Calendar';
import {GetEmployeeCalendar} from '../../../../client-api/employees';
import type {EmployeeCalendarProjection} from '../../../../client-api/employees';
import {getMonthDateRange} from '../../../../lib/utils';

const styles = {
  input: 'border p-2 rounded-md bg-tertiary',
  textArea: 'border rounded-md w-full bg-tertiary',
  div: 'p-5 grid grid-cols-1 md:grid-cols-2 gap-4 w-full',
   form: `flex flex-col justify-center items-center p-2 bg-tertiary border
    border-bg-quaternary rounded-md w-full max-w-6xl mx-auto text-sm lg:text-base hide-on-print print:hidden`
};

export type CreateCallOutFormProps = {
  leaveTypes: LeaveTypeAttributes[];
  employees: EmployeeWithAssociations[];
  callback?: (data: CallOutWithAssociations) => void;
};

export function CreateCallOutForm({
  callback,
  employees,
  leaveTypes
}: Readonly<CreateCallOutFormProps>) {
  const [calendar, setCalendar] = useState<EmployeeCalendarProjection | null>(null);
  const [calendarRefreshId, setCalendarRefreshId] = useState(0);

  const wrappedCallback = (data: CallOutWithAssociations) => {
    callback?.(data);
    setCalendarRefreshId(prev => prev + 1);
  };

  const {
    formData,
    callTime,
    shiftTime,
    resetFormData,
    onChangeHandler,
    handleFormSubmit,
    handleCallTimeChange,
    handleShiftTimeChange
  }: UseCreateCallOutFormState = useCreateCallOutFormState(wrappedCallback);

  useEffect(() => {
    if (!formData.employeeName) {
      setCalendar(null);
      return;
    }

    (async () => {
      const {startDate, endDate} = getMonthDateRange(formData.callDate);
      const response = await GetEmployeeCalendar({
        employeeId: formData.employeeName,
        startDate,
        endDate
      });

      setCalendar(response.data ?? null);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData.employeeName, formData.callDate, calendarRefreshId]);

  const handleFormValueChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    onChangeHandler(e);
  };

  const selectedEmployee = employees.find(employee => employee.id === trim(formData.employeeName));
  const isEmployeeParkingContext = employees.some(employee =>
    employee.divisions?.some(division => division.name === 'Employee Parking')
  );

  const handleEnter = (e: React.KeyboardEvent<HTMLFormElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      e.stopPropagation();
      handleFormSubmit(e);
    }
  };

  return (
    <form //NOSONAR
      onKeyDown={handleEnter}
      className={trim(styles.form)}>
      {' '}
      {/*NOSONAR */}
      <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-4 items-start">
        <div className={styles.div}>
          <SelectEmployeeName
            employees={employees}
            className={styles.input}
            onChangeHandler={handleFormValueChange}
            employeeName={trim(formData.employeeName)}
          />

          {isEmployeeParkingContext && (
            <DisabledTextInput
              name="shuttleNumber"
              label="Shuttle Number"
              className={styles.input}
              value={selectedEmployee?.shuttle_number || 'Not Assigned'}
            />
          )}

          <DateInput
            name="callDate"
            label="Call Date"
            className={styles.input}
            date={formData.callDate}
            onChangeHandler={handleFormValueChange}
          />

        <TimeInput
          name="callTime"
          time={callTime}
          label="Call Time"
          className={styles.input}
          onChangeHandler={handleCallTimeChange}
        />

        <TimeInput
          name="shiftTime"
          time={shiftTime}
          label="Shift Time"
          className={styles.input}
          onChangeHandler={handleShiftTimeChange}
        />

          <DateInput
            name="shiftDate"
            label="Shift Date From"
            className={styles.input}
            date={formData.shiftDate}
            onChangeHandler={handleFormValueChange}
          />

          <DateInput
            name="shiftDateTo"
            label="Shift Date To"
            required={false}
            className={styles.input}
            date={formData.shiftDateTo}
            onChangeHandler={handleFormValueChange}
          />

          <SelectLeaveTypeReason
            leaveTypes={leaveTypes}
            className={`${styles.input} md:col-span-2`}
            leaveType={formData.leaveType}
            onChangeHandler={handleFormValueChange}
          />

          <LeftEarlyWithRange value={formData.leftEarlyMinutes} onChangeHandler={handleFormValueChange} />

          <ArrivedLateWithRange
            value={formData.lateArrivalMinutes}
            onChangeHandler={handleFormValueChange}
          />
        </div>
        <EmployeeScheduleCalendar calendar={calendar} />
      </div>
      <div className="w-full p-4">
        <TextArea
          required={true}
          name="comment"
          label="Comments"
          value={formData.comment}
          className={styles.textArea}
          onChangeHandler={handleFormValueChange}
        />
      </div>
      <CallOutFormActionButtons resetFormData={resetFormData} handleFormSubmit={handleFormSubmit} />
    </form>
  );
}
