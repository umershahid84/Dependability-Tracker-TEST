import React, {useEffect, useState} from 'react';
import {InferGetServerSidePropsType} from 'next';
import {getDefaultFormData, useIsMounted} from '@/hooks';
import {dateToHH_MM_SS_sss, dateToYYYY_MM_DD} from '@/lib/utils';
import {DivisionLayout, makeToast, ToastTypes} from '@/components';
import {getDivisionFromDB, getEmployeeFromDB, getLeaveTypeFromDB} from '@/lib/db/controller';
import {
  DivisionAttributes,
  LeaveTypeAttributes,
  EmployeeWithAssociations
} from '@/lib/db/models/types';
import {DefaultLeaveTypes} from '@/lib/db/models';

export type DefaultCallOutFormData = {
  callDate: Date;
  callTime: string;
  comment: string;
  shiftDate: Date;
  shiftTime: string;
  leaveType: string;
  employeeName: string;
  leftEarlyMinutes: number;
  lateArrivalMinutes: number;
};

const now = new Date();

const defaultFormData: DefaultCallOutFormData = getDefaultFormData();

function InputContainer({label, children}: {label: string; children: React.ReactNode}) {
  return (
    <div className="flex flex-col w-full">
      <label className="font-medium mb-1">{label}</label>
      {children}
    </div>
  );
}

export const getServerSideProps = async (request: {req: Request}) => {
  const path = request.req.url;

  const words = path.split('/')[1].replace('-', ' ')?.split(' ');

  for (let word of words) {
    word = word.charAt(0).toUpperCase() + word.slice(1);
  }

  const division: DivisionAttributes | null = await getDivisionFromDB.byName(words?.join(' '));

  const divisionEmployees: (EmployeeWithAssociations | null)[] =
    await getEmployeeFromDB.all.byDivision(division?.id ?? '');

  const sortBy: DefaultLeaveTypes[] = [
    DefaultLeaveTypes.SICK,
    DefaultLeaveTypes.FCA,
    DefaultLeaveTypes.FMLA,
    DefaultLeaveTypes.NO_CALL_NO_SHOW,
    DefaultLeaveTypes.BEREAVEMENT,
    DefaultLeaveTypes.LATE_ARRIVAL,
    DefaultLeaveTypes.LEFT_EARLY,
    DefaultLeaveTypes.LWOP,
    DefaultLeaveTypes.VACATION,
    DefaultLeaveTypes.PERSONAL_HOLIDAY,
    DefaultLeaveTypes.HOLIDAY,
    DefaultLeaveTypes.PHEL,
    DefaultLeaveTypes.JURY_DUTY,
    DefaultLeaveTypes.MATERNITY,
    DefaultLeaveTypes.PATERNITY,
    DefaultLeaveTypes.MILITARY,
    DefaultLeaveTypes.OTHER
  ];
  const leaveTypes: (LeaveTypeAttributes | null)[] = await getLeaveTypeFromDB.all();

  leaveTypes.sort(
    (a, b) =>
      sortBy.indexOf(a?.reason as DefaultLeaveTypes) -
      sortBy.indexOf(b?.reason as DefaultLeaveTypes)
  );

  return {
    props: {
      employees: JSON.stringify(divisionEmployees),
      leaveTypes: JSON.stringify(leaveTypes)
    }
  };
};

export default function EmployeeParkingPage(
  props: InferGetServerSidePropsType<typeof getServerSideProps>
) {
  const isMounted = useIsMounted();
  const [callTime, setCallTime] = useState<string>(dateToHH_MM_SS_sss(now));
  const [formData, setFormData] = useState<DefaultCallOutFormData>(defaultFormData);
  const [callTimeInterval, setCallTimeInterval] = useState<NodeJS.Timeout | null>(null);

  const onChangeHandler = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const {name, value} = e.target;
    setFormData({...formData, [name]: value});
  };

  const handleCallTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {value} = e.target;
    callTimeInterval && clearInterval(callTimeInterval);
    setCallTime(value);
  };

  const handleFormSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const result = await fetch('/api/employee-callout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        ...formData,
        callTime
      })
    });

    const data = await result.json();

    if (!result.ok) {
      makeToast({
        title: 'Error',
        type: ToastTypes.Error,
        message: data.error,
        timeOut: 7500
      });
    } else {
      makeToast({
        title: 'Success',
        type: ToastTypes.Success,
        message: data.message
      });

      setFormData(defaultFormData);
    }
  };

  useEffect(() => {
    isMounted &&
      setCallTimeInterval(
        setInterval(() => {
          const now = new Date();
          setCallTime(dateToHH_MM_SS_sss(now));
        }, 1000)
      );
    return () => {
      callTimeInterval && clearInterval(callTimeInterval);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMounted]);

  return (
    <DivisionLayout>
      <div className="flex flex-col flex-wrap justify-center items-center gap-8">
        <h3 className="mt-4 text-2xl">
          <strong>Create CallOut</strong>
        </h3>
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
                value={dateToYYYY_MM_DD(formData.callDate)}
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
                value={dateToYYYY_MM_DD(formData.shiftDate)}
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
        <div className="w-full flex flex-col overflow-x-auto mx-auto">
          <h2 className="text-xl font-semibold my-2 text-center">Two Week Callout History</h2>
          <table
            id="dependabilityTable"
            className="w-full table-auto text-left border-collapse mb-6 text-sm lg:text-base">
            <thead>
              <tr className="bg-gray-200 dark:bg-slate-900">
                <th className="px-4 py-2 border dark:border-gray-600">Employee Name</th>
                <th className="px-4 py-2 border dark:border-gray-600">Call Date</th>
                <th className="px-4 py-2 border dark:border-gray-600">Call Time</th>
                <th className="px-4 py-2 border dark:border-gray-600">Shift Date</th>
                <th className="px-4 py-2 border dark:border-gray-600">Shift Time</th>
                <th className="px-4 py-2 border dark:border-gray-600">Leave Type</th>
              </tr>
            </thead>
            <tbody id="dependabilityData"></tbody>
          </table>
        </div>
      </div>
    </DivisionLayout>
  );
}
