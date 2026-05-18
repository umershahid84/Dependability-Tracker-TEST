'use client';
import React, {useState} from 'react';
import {DivisionLayout} from '../Division';
import {DivisionReportForm} from '../Forms';
import {DetailedCallOutHistory} from './DetailedCallOutReport';
import {CallOutWithAssociations} from '../../lib/db/models/types';
import {EmployeeCalendarProjection} from '../../client-api/employees';

export function DivisionReport(
  props: Readonly<{
    employees: string;
    leaveTypes: string;
    divisions: string;
    isAdmin?: boolean;
  }>
) {
  const [loading, setLoading] = useState<boolean>(false);
  const [callOuts, setCallOuts] = useState<CallOutWithAssociations[]>([]);
  const [calendar, setCalendar] = useState<EmployeeCalendarProjection | null>(null);

  return (
    <DivisionLayout isAdmin={props.isAdmin}>
      <div className="w-full h-auto flex flex-col justify-center items-center gap-8 mt-8">
        <h1 className="text-2xl hide-on-print text-center">
          <strong>Generate Call-Out Report</strong>
        </h1>

        <DivisionReportForm
          isLoading={loading}
          setIsLoading={setLoading}
          setCallOuts={setCallOuts}
          setCalendar={setCalendar}
          divisions={props.divisions}
          employees={props.employees}
          leaveTypes={props.leaveTypes}
        />

        {callOuts.length > 0 && (
          <DetailedCallOutHistory callOuts={callOuts} calendar={calendar} showDownloadButton />
        )}
      </div>
    </DivisionLayout>
  );
}
