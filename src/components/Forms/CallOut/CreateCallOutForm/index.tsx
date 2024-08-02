import React from 'react';
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
import { LeftEarlyWithRange } from '../../FormInputs/LeftEarlyWithRange';
import { SelectLeaveTypeReason } from '../../FormInputs/SelectLeaveType';
import { ArrivedLateWithRange } from '../../FormInputs/ArrivedLateWithRange';
import { CallOutFormActionButtons } from '../../FormInputs/CallOutFormActionButtons';
import { UseCreateCallOutFormState, useCreateCallOutFormState } from '../../../../hooks';

const styles = {
  input: 'border p-2 rounded-md bg-tertiary',
  textArea: 'border rounded-md w-full bg-tertiary',
  div: 'p-5 grid grid-cols-1 md:grid-cols-2 gap-4 w-full',
  form: `flex flex-col justify-center items-center p-2 bg-tertiary border
   border-bg-quaternary rounded-md w-full max-w-3xl mx-auto text-sm lg:text-base hide-on-print print:hidden`
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
  const {
    formData,
    callTime,
    shiftTime,
    resetFormData,
    onChangeHandler,
    handleFormSubmit,
    handleCallTimeChange,
    handleShiftTimeChange
  }: UseCreateCallOutFormState = useCreateCallOutFormState(callback);

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
      <div className={styles.div}>
        <SelectEmployeeName
          employees={employees}
          className={styles.input}
          onChangeHandler={onChangeHandler}
          employeeName={trim(formData.employeeName)}
        />

        <DateInput
          name="callDate"
          label="Call Date"
          className={styles.input}
          date={formData.callDate}
          onChangeHandler={onChangeHandler}
        />

        <TimeInput
          name="callTime"
          time={callTime}
          label="Call Time"
          className={styles.input}
          onChangeHandler={handleCallTimeChange}
        />

        <DateInput
          name="shiftDate"
          label="Shift Date"
          className={styles.input}
          date={formData.shiftDate}
          onChangeHandler={onChangeHandler}
        />

        <TimeInput
          name="shiftTime"
          time={shiftTime}
          label="Shift Time"
          className={styles.input}
          onChangeHandler={handleShiftTimeChange}
        />

        <SelectLeaveTypeReason
          leaveTypes={leaveTypes}
          className={styles.input}
          leaveType={formData.leaveType}
          onChangeHandler={onChangeHandler}
        />

        <ArrivedLateWithRange
          value={formData.lateArrivalMinutes}
          onChangeHandler={onChangeHandler}
        />

        <LeftEarlyWithRange value={formData.leftEarlyMinutes} onChangeHandler={onChangeHandler} />
      </div>
      <div className="w-full p-4">
        <TextArea
          required={true}
          name="comment"
          label="Comments"
          value={formData.comment}
          className={styles.textArea}
          onChangeHandler={onChangeHandler}
        />
      </div>
      <CallOutFormActionButtons resetFormData={resetFormData} handleFormSubmit={handleFormSubmit} />
    </form>
  );
}
