import Form from '../../Form';
import Loading from '../../../Loading';
import {
  DivisionAttributes,
  LeaveTypeAttributes,
  CallOutWithAssociations,
  EmployeeWithAssociations
} from '../../../../lib/db/models/types';
import { useIsMounted } from '../../../../hooks';
import { ClientAPI } from '../../../../client-api';
import React, { useEffect, useState } from 'react';
import { NextRouter, useRouter } from 'next/router';
import { DateInput } from '../../FormInputs/DateInput';
import { makeToast, ToastTypes } from '../../../Toasts';
import { SelectDivision } from '../../FormInputs/SelectDivision';
import { SelectEmployeeName } from '../../../Forms/FormInputs/SelectEmployeeName';
import { SelectLeaveTypeReason } from '../../../Forms/FormInputs/SelectLeaveType';
import { capitalizeWords, getDivisionNameFromPath } from '../../../../lib/utils/shared/strings';

export type DivisionCalloutReportFormData = {
  endDate: Date;
  startDate: Date;
  division: string;
  employeeId: string;
  leaveTypeId: string;
};

const today = () => new Date();
const twoWeeksBeforeNow = () => new Date(today().setDate(today().getDate() - 14));
export const defaultDivisionCalloutReportFormData: DivisionCalloutReportFormData = {
  division: '',
  employeeId: '',
  leaveTypeId: '',
  endDate: today(),
  startDate: twoWeeksBeforeNow()
};

export type DivisionReportProps = {
  employees: string;
  divisions: string;
  isLoading: boolean;
  leaveTypes: string;
  setIsLoading: (isLoading: boolean) => void;
  setCallOuts: (callOuts: CallOutWithAssociations[]) => void;
};

export function DivisionReportForm(props: Readonly<DivisionReportProps>) {
  const router: NextRouter = useRouter();
  const isMounted: boolean = useIsMounted();
  const [formData, setFormData] = useState<DivisionCalloutReportFormData>(
    defaultDivisionCalloutReportFormData
  );

  const divisionData: DivisionAttributes[] = JSON.parse(props.divisions);

  const handleOnChange = (event: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value
    });
  };

  const handleSubmit = async (e: React.SyntheticEvent<HTMLButtonElement | HTMLFormElement>) => {
    e.preventDefault();
    e.stopPropagation();

    props.setIsLoading(true);

    const callout_date_range: [Date, Date] = [formData.startDate, formData.endDate];
    const employee_id: string | undefined =
      formData.employeeId !== 'all' && formData.employeeId !== ''
        ? formData.employeeId
        : JSON.parse(props.employees).map((e: EmployeeWithAssociations) => e.id);
    const leave_type_id: string | undefined =
      formData.leaveTypeId !== 'all' && formData.leaveTypeId !== ''
        ? formData.leaveTypeId
        : JSON.parse(props.leaveTypes).map((e: LeaveTypeAttributes) => e.id);

    try {
      const callOuts = await ClientAPI.CallOuts.Read(
        { limit: '-1' },
        {
          employee_id,
          leave_type_id,
          callout_date_range
        }
      );

      props.setCallOuts(callOuts?.data?.data ?? []);

      props.setIsLoading(false);
    } catch (error) {
      makeToast({
        title: 'Error',
        type: ToastTypes.Error,
        message: String(error)
      });

      props.setIsLoading(false);
    }
  };

  useEffect(() => {
    const currentDivision = capitalizeWords(getDivisionNameFromPath(router.pathname));
    const currentDivisionId = divisionData.find(
      (d: DivisionAttributes) => d.name === currentDivision
    )?.id;

    isMounted && setFormData({ ...formData, division: currentDivisionId ?? '' });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMounted]);

  useEffect(() => {
    const currentDivision = capitalizeWords(getDivisionNameFromPath(router.pathname));

    const currentDivisionId = formData.division;

    const divisionFromDivisionData = divisionData.find(
      (d: DivisionAttributes) => d.id === currentDivisionId
    );

    if (currentDivision !== divisionFromDivisionData?.name) {
      switch (divisionFromDivisionData?.name) {
        case 'Employee Parking':
          router.push('/divisions/employee-parking/reports');
          break;
        case 'Public Parking':
          router.push('/divisions/public-parking/reports');
          break;
        case 'Ground Transportation':
          router.push('/divisions/ground-transportation/reports');
          break;
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData.division]);

  return (
    <>
      <div>
        <SelectDivision
          name="division"
          showAny={false}
          title=""
          divisions={divisionData}
          value={formData.division}
          onChangeHandler={handleOnChange}
          className="p-3 mt-2 text-center rounded-md w-auto bg-tertiary text-primary hover:bg-secondary hide-on-print"
        />
      </div>

      <Form
        onEnter={handleSubmit}
        className={`flex flex-col justify-center items-center w-full sm:min-w-[650px] lg:min-w-[850px] max-w-2xl bg-tertiary p-4
   rounded-md gap-2 hide-on-print`}>
        <div className="w-full grid grid-cols-2 mt-4 gap-x-16 gap-y-4">
          <SelectEmployeeName
            title="Employee"
            name="employeeId"
            useSelectAll={true}
            onChangeHandler={handleOnChange}
            employeeName={formData.employeeId}
            employees={JSON.parse(props.employees)}
          />

          <SelectLeaveTypeReason
            name="leaveTypeId"
            title="Leave Type"
            useSelectAll={true}
            onChangeHandler={handleOnChange}
            leaveType={formData.leaveTypeId}
            leaveTypes={JSON.parse(props.leaveTypes)}
          />

          <DateInput
            name="startDate"
            label="Start Date"
            date={formData.startDate}
            onChangeHandler={handleOnChange}
          />

          <DateInput
            name="endDate"
            label="End Date"
            date={formData.endDate}
            onChangeHandler={handleOnChange}
          />
        </div>
        {props.isLoading ? (
          <Loading label="Searching for Call Outs..." />
        ) : (
          <button
            type="button"
            className="bg-blue-500 text-primary rounded-md py-2 px-4 hover:bg-accent-primary mt-8 w-96"
            onClick={handleSubmit}>
            Generate Report
          </button>
        )}
      </Form>
    </>
  );
}
