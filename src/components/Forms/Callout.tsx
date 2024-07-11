import React from 'react';
import {dateTo_YYYY_MM_DD} from '@/lib/utils';
import {UseCallOutFormState, useCallOutFormState} from '@/hooks';
import {LeaveTypeAttributes, EmployeeWithAssociations} from '@/lib/db/models/types';

function InputContainer({label, children}: {label: string; children: React.ReactNode}) {
  return (
    <div className="flex flex-col w-full">
      <label className="font-medium mb-1">{label}</label>
      {children}
    </div>
  );
}

export default function CallOutForm(props: {employees: string; leaveTypes: string}) {
  const {
    formData,
    callTime,
    onChangeHandler,
    handleFormSubmit,
    handleCallTimeChange
  }: UseCallOutFormState = useCallOutFormState();

  return (
    <form
      id="dependabilityForm"
      className="flex flex-col justify-center items-center p-2  bg-gray-100 dark:bg-slate-900 dark:border dark:border-slate-600 rounded-md w-full max-w-3xl mx-auto text-sm lg:text-base">
      <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-4 w-full ">
        <InputContainer label="Employee Name">
          <select
            id="employeeName"
            name="employeeName"
            title="Employee Name"
            required
            value={formData.employeeName}
            onChange={onChangeHandler}
            className="border p-2 rounded-md dark:bg-slate-800">
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
            type="date"
            id="callDate"
            name="callDate"
            title="Call Date"
            required
            value={dateTo_YYYY_MM_DD(formData.callDate)}
            onChange={onChangeHandler}
            className="border p-2 rounded-md dark:bg-slate-800"
          />
        </InputContainer>

        <InputContainer label="Call Time">
          <input
            type="time"
            id="callTime"
            name="callTime"
            title="Call Time"
            required
            value={callTime}
            onChange={handleCallTimeChange}
            className="border p-2 rounded-md dark:bg-slate-800"
          />
        </InputContainer>

        <InputContainer label="Shift Date">
          <input
            type="date"
            id="shiftDate"
            name="shiftDate"
            title="Shift Date"
            required
            value={dateTo_YYYY_MM_DD(formData.shiftDate)}
            onChange={onChangeHandler}
            className="border p-2 rounded-md dark:bg-slate-800"
          />
        </InputContainer>

        <InputContainer label="Shift Time">
          <input
            type="time"
            id="shiftTime"
            name="shiftTime"
            title="Shift Time"
            required
            value={formData.shiftTime}
            onChange={onChangeHandler}
            className="border p-2 rounded-md dark:bg-slate-800"
          />
        </InputContainer>

        <InputContainer label="Leave Type">
          <select
            id="leaveType"
            name="leaveType"
            title="Leave Type"
            required
            value={formData.leaveType}
            onChange={onChangeHandler}
            className="border p-2 rounded-md dark:bg-slate-800">
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
            type="number"
            id="lateArrivalMinutes"
            name="lateArrivalMinutes"
            min="0"
            max="79"
            step="1"
            placeholder="Minutes"
            value={formData.lateArrivalMinutes}
            onChange={onChangeHandler}
            className="border p-[5.5px] rounded-md w-full dark:bg-slate-800"
          />
        </InputContainer>

        <InputContainer label="Left Early (Mins)">
          <input
            type="number"
            id="leftEarlyMinutes"
            name="leftEarlyMinutes"
            min="0"
            max="59"
            step="1"
            placeholder="Minutes"
            value={formData.leftEarlyMinutes}
            onChange={onChangeHandler}
            className="border p-[5.5px] rounded-md w-full dark:bg-slate-800"
          />
        </InputContainer>
      </div>
      <div className="w-full p-4">
        <InputContainer label="Comments">
          <textarea
            id="comment"
            name="comment"
            title="Comments"
            rows={4}
            value={formData.comment}
            onChange={onChangeHandler}
            className="border p- rounded-md w-full dark:bg-slate-800"
            required></textarea>
        </InputContainer>
      </div>

      <div className="flex flex-wrap flex-row justify-between items-center w-[80%] p-5">
        <input
          type="button"
          value="Submit"
          onClick={handleFormSubmit}
          className="bg-[var(--green)] rounded-md p-3 dark:bg-slate-950 dark:hover:bg-[var(--green)] hover:scale-105 text-white drop-shadow-md"
        />
        <input
          type="reset"
          value="Reset"
          className="bg-red-600 dark:bg-slate-950 dark:hover:bg-red-600 rounded-md p-3 hover:scale-105 text-white drop-shadow-md"
        />
      </div>
    </form>
  );
}
