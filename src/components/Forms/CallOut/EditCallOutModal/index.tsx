import { TextArea } from '../../FormInputs/TextArea';
import { DateInput } from '../../FormInputs/DateInput';
import { TimeInput } from '../../FormInputs/TimeInput';
import { trim } from '../../../../lib/utils/shared/strings';
import { DefaultCallOutFormData } from '../../../../client-api';
import { dateTo_HH_MM_SS, makeDate } from '../../../../lib/utils';
import { useCallOutAdvancedSearchContext } from '../../../../providers';
import { LeftEarlyWithRange } from '../../FormInputs/LeftEarlyWithRange';
import { SelectEmployeeName } from '../../FormInputs/SelectEmployeeName';
import { SelectLeaveTypeReason } from '../../FormInputs/SelectLeaveType';
import { CallOutWithAssociations } from '../../../../lib/db/models/types';
import { ArrivedLateWithRange } from '../../FormInputs/ArrivedLateWithRange';
import { CallOutFormActionButtons } from '../../FormInputs/CallOutFormActionButtons';
import { UseEditCallOutFormState, useEditCallOutFormState } from '../../../../hooks';

export type EditCallOutModalProps = {
  callOutData: CallOutWithAssociations;
  onModalEditCallBack: (callOut: CallOutWithAssociations) => void;
};

const styles = {
  h2: 'text-2xl font-bold my-4 text-center',
  input: 'border p-2 rounded-md bg-tertiary',
  textArea: 'border rounded-md w-full bg-tertiary',
  div: 'p-3 grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4 w-full h-full',
  form: `flex flex-col justify-center items-center p-2 rounded-md w-full max-w-3xl mx-auto text-sm lg:text-base hide-on-print bg-tertiary`
};

export function EditCallOutModal({
  callOutData,
  onModalEditCallBack
}: Readonly<EditCallOutModalProps>) {
  const defaultFormData: DefaultCallOutFormData = {
    comment: callOutData.supervisor_comments,
    shiftDate: makeDate(callOutData.shift_date),
    callDate: makeDate(callOutData.callout_date),
    leaveType: callOutData.leaveType.id.toString(),
    employeeName: callOutData.employee.id.toString(),
    shiftTime: dateTo_HH_MM_SS(callOutData.shift_time),
    leftEarlyMinutes: callOutData?.left_early_mins ?? 0,
    callTime: dateTo_HH_MM_SS(callOutData.callout_time),
    lateArrivalMinutes: callOutData?.arrived_late_mins ?? 0
  };
  const { employees, leaveTypes } = useCallOutAdvancedSearchContext();
  const { formData, resetFormData, onChangeHandler, handleFormSubmit }: UseEditCallOutFormState =
    useEditCallOutFormState(callOutData.id, defaultFormData, onModalEditCallBack);

  const handleEnter = (e: React.KeyboardEvent<HTMLFormElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      e.stopPropagation();
      handleFormSubmit(e);
    }
  };

  return (
    <>
      <h2 className={styles.h2}>{'Edit CallOut'}</h2>
      <form //NOSONAR
        onKeyDown={handleEnter}
        className={trim(styles.form)}>
        <div className={styles.div}>
          <SelectEmployeeName
            employees={employees}
            onChangeHandler={onChangeHandler}
            className={styles.input + ' p-[10.5px]'}
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
            label="Call Time"
            className={styles.input}
            time={formData.callTime}
            onChangeHandler={onChangeHandler}
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
            label="Shift Time"
            className={styles.input}
            time={formData.shiftTime}
            onChangeHandler={onChangeHandler}
          />

          <SelectLeaveTypeReason
            leaveTypes={leaveTypes}
            leaveType={formData.leaveType}
            onChangeHandler={onChangeHandler}
            className={styles.input + ' p-[10.5px]'}
          />

          <ArrivedLateWithRange
            value={formData.lateArrivalMinutes}
            onChangeHandler={onChangeHandler}
          />

          <LeftEarlyWithRange value={formData.leftEarlyMinutes} onChangeHandler={onChangeHandler} />
        </div>
        <div className="w-full p-4">
          <TextArea
            name="comment"
            label="Comments"
            value={formData.comment}
            onChangeHandler={onChangeHandler}
            className={styles.textArea}
          />
        </div>
        <CallOutFormActionButtons
          resetFormData={resetFormData}
          handleFormSubmit={handleFormSubmit}
        />
      </form>
    </>
  );
}
