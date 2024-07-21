import React from 'react';
import {
  LeaveTypeAttributes,
  CallOutWithAssociations,
  EmployeeWithAssociations
} from '../../lib/db/models/types';
import {FormLabel} from './FormLabel';
import {dateTo_YYYY_MM_DD} from '../../lib/utils';
import {trim} from '../../lib/utils/shared/strings';
import {UseCallOutFormState, useCallOutFormState} from '../../hooks';

function InputContainer({
  label,
  children,
  htmlFor
}: Readonly<{label: string; children: React.ReactNode; htmlFor: string}>) {
  return (
    <div className="flex flex-col w-full">
      <FormLabel label={label} htmlFor={htmlFor} className={'font-medium mb-1'} />
      {children}
    </div>
  );
}

const styles = {
  input: 'border p-2 rounded-md bg-slate-800',
  textArea: 'border rounded-md w-full bg-slate-800',
  div: 'p-5 grid grid-cols-1 md:grid-cols-2 gap-4 w-full',
  inputNumber: 'border p-[5.5px] rounded-md w-full bg-slate-800',
  buttonContainer: `flex flex-wrap flex-row justify-between items-center w-[80%] p-5`,
  form: `flex flex-col justify-center items-center p-2 bg-slate-900 border
   border-slate-600 rounded-md w-full max-w-3xl mx-auto text-sm lg:text-base hide-on-print`,
  submit: `rounded-md p-3 bg-slate-950 hover:bg-[var(--green)] hover:scale-105 text-white drop-shadow-md`,
  reset: `bg-slate-950 hover:bg-red-600 rounded-md p-3 hover:scale-105 text-white
   drop-shadow-md`
};

export default function CreateCallOutForm(
  props: Readonly<{
    employees: string;
    leaveTypes: string;
    callback?: (data: CallOutWithAssociations) => void;
  }>
) {
  const {
    formData,
    callTime,
    shiftTime,
    resetFormData,
    onChangeHandler,
    handleFormSubmit,
    handleCallTimeChange,
    handleShiftTimeChange
  }: UseCallOutFormState = useCallOutFormState(props.callback);

  const handleEnter = (e: React.KeyboardEvent<HTMLFormElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      e.stopPropagation();
      handleFormSubmit(e);
    }
  };

  return (
    <form className={trim(styles.form)} onKeyDown={handleEnter}>
      <div className={styles.div}>
        <InputContainer label="Employee Name" htmlFor="employeeName">
          <select
            required
            name="employeeName"
            title="Employee Name"
            className={styles.input}
            onChange={onChangeHandler}
            value={trim(formData.employeeName)}>
            <option value="">Select Employee</option>
            {props.employees &&
              JSON.parse(props.employees).map((employee: EmployeeWithAssociations) => (
                <option key={employee.id} value={employee.id}>
                  {employee.name}
                </option>
              ))}
          </select>
        </InputContainer>

        <InputContainer label="Call Date" htmlFor="callDate">
          <input
            required
            type="date"
            name="callDate"
            title="Call Date"
            className={styles.input}
            onChange={onChangeHandler}
            value={dateTo_YYYY_MM_DD(formData.callDate)}
          />
        </InputContainer>

        <InputContainer label="Call Time" htmlFor="callTime">
          <input
            required
            type="time"
            name="callTime"
            title="Call Time"
            value={callTime}
            className={styles.input}
            onChange={handleCallTimeChange}
          />
        </InputContainer>

        <InputContainer label="Shift Date" htmlFor="shiftDate">
          <input
            required
            type="date"
            name="shiftDate"
            title="Shift Date"
            className={styles.input}
            onChange={onChangeHandler}
            value={dateTo_YYYY_MM_DD(formData.shiftDate)}
          />
        </InputContainer>

        <InputContainer label="Shift Time" htmlFor="shiftTime">
          <input
            required
            type="time"
            name="shiftTime"
            title="Shift Time"
            value={shiftTime}
            className={styles.input}
            onChange={handleShiftTimeChange}
          />
        </InputContainer>

        <InputContainer label="Leave Type" htmlFor="leaveType">
          <select
            required
            name="leaveType"
            title="Leave Type"
            className={styles.input}
            value={formData.leaveType}
            onChange={onChangeHandler}>
            <option value="">Select Leave Type</option>
            {props.leaveTypes &&
              JSON.parse(props.leaveTypes).map((leaveType: LeaveTypeAttributes) => (
                <option key={leaveType.id} value={leaveType.id}>
                  {leaveType.reason}
                </option>
              ))}
          </select>
        </InputContainer>

        <InputContainer label="Arrived Late (Mins)" htmlFor="lateArrivalMinutes">
          <input
            min="0"
            max="600"
            step="1"
            type="number"
            placeholder="Minutes"
            name="lateArrivalMinutes"
            title="Arrived Late (Mins)"
            onChange={onChangeHandler}
            className={styles.inputNumber}
            value={formData.lateArrivalMinutes}
          />

          <input
            min="0"
            max="600"
            type="range"
            name="lateArrivalMinutes"
            title="Arrived Late (Mins)"
            onChange={onChangeHandler}
            className={styles.inputNumber}
            value={formData.lateArrivalMinutes}
          />
        </InputContainer>

        <InputContainer label="Left Early (Mins)" htmlFor="leftEarlyMinutes">
          <input
            min="0"
            max="600"
            step="1"
            type="number"
            placeholder="Minutes"
            name="leftEarlyMinutes"
            title="Left Early (Mins)"
            onChange={onChangeHandler}
            className={styles.inputNumber}
            value={formData.leftEarlyMinutes}
          />

          <input
            min="0"
            max="600"
            type="range"
            name="leftEarlyMinutes"
            title="Left Early (Mins)"
            onChange={onChangeHandler}
            className={styles.inputNumber}
            value={formData.leftEarlyMinutes}
          />
        </InputContainer>
      </div>
      <div className="w-full p-4">
        <InputContainer label="Comments" htmlFor="comment">
          <textarea
            rows={4}
            required
            name="comment"
            title="Comments"
            value={formData.comment}
            onChange={onChangeHandler}
            className={styles.textArea}></textarea>
        </InputContainer>
      </div>

      <div className={styles.buttonContainer}>
        <input type="button" value="Submit" onClick={handleFormSubmit} className={styles.submit} />
        <input type="reset" value="Reset" className={trim(styles.reset)} onClick={resetFormData} />
      </div>
    </form>
  );
}
