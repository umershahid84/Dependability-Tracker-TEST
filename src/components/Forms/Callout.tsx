import React from 'react';
import {dateTo_YYYY_MM_DD} from '../../lib/utils';
import {trim} from '../../lib/utils/shared/strings';
import {UseCallOutFormState, useCallOutFormState} from '../../hooks';
import {
  LeaveTypeAttributes,
  EmployeeWithAssociations,
  CallOutWithAssociations
} from '../../lib/db/models/types';

function InputContainer({label, children}: {label: string; children: React.ReactNode}) {
  return (
    <div className="flex flex-col w-full">
      <label className="font-medium mb-1">{label}</label>
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
   border-slate-600 rounded-md w-full max-w-3xl mx-auto text-sm lg:text-base`,
  submit: `rounded-md p-3 bg-slate-950 hover:bg-[var(--green)] hover:scale-105 text-white drop-shadow-md`,
  reset: `bg-slate-950 hover:bg-red-600 rounded-md p-3 hover:scale-105 text-white
   drop-shadow-md`
};

export default function CallOutForm(props: {
  employees: string;
  leaveTypes: string;
  callback?: (data: CallOutWithAssociations) => void;
}) {
  const {
    formData,
    callTime,
    resetFormData,
    onChangeHandler,
    handleFormSubmit,
    handleCallTimeChange
  }: UseCallOutFormState = useCallOutFormState(props.callback);

  return (
    <form id="dependabilityForm" className={trim(styles.form)}>
      <div className={styles.div}>
        <InputContainer label="Employee Name">
          <select
            required
            id="employeeName"
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

        <InputContainer label="Call Date">
          <input
            required
            type="date"
            id="callDate"
            name="callDate"
            title="Call Date"
            className={styles.input}
            onChange={onChangeHandler}
            value={dateTo_YYYY_MM_DD(formData.callDate)}
          />
        </InputContainer>

        <InputContainer label="Call Time">
          <input
            required
            type="time"
            id="callTime"
            name="callTime"
            title="Call Time"
            value={callTime}
            className={styles.input}
            onChange={handleCallTimeChange}
          />
        </InputContainer>

        <InputContainer label="Shift Date">
          <input
            required
            type="date"
            id="shiftDate"
            name="shiftDate"
            title="Shift Date"
            className={styles.input}
            onChange={onChangeHandler}
            value={dateTo_YYYY_MM_DD(formData.shiftDate)}
          />
        </InputContainer>

        <InputContainer label="Shift Time">
          <input
            required
            type="time"
            id="shiftTime"
            name="shiftTime"
            title="Shift Time"
            className={styles.input}
            value={formData.shiftTime}
            onChange={onChangeHandler}
          />
        </InputContainer>

        <InputContainer label="Leave Type">
          <select
            required
            id="leaveType"
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

        <InputContainer label="Arrived Late (Mins)">
          <input
            min="0"
            max="600"
            step="1"
            type="number"
            placeholder="Minutes"
            id="lateArrivalMinutes"
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
            id="lateArrivalMinutesSlider"
            onChange={onChangeHandler}
            className={styles.inputNumber}
            value={formData.lateArrivalMinutes}
          />
        </InputContainer>

        <InputContainer label="Left Early (Mins)">
          <input
            min="0"
            max="600"
            step="1"
            type="number"
            id="leftEarlyMinutes"
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
            id="leftEarlyMinutesSlider"
            onChange={onChangeHandler}
            className={styles.inputNumber}
            value={formData.leftEarlyMinutes}
          />
        </InputContainer>
      </div>
      <div className="w-full p-4">
        <InputContainer label="Comments">
          <textarea
            rows={4}
            required
            id="comment"
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
