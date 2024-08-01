import React, { useState } from 'react';
import { DivisionLayout } from '../Division';
import { DivisionReportForm } from '../Forms';
import { DetailedCallOutHistory } from './DetailedCallOutReport';
import { CallOutWithAssociations } from '../../lib/db/models/types';

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
          divisions={props.divisions}
          employees={props.employees}
          leaveTypes={props.leaveTypes}
        />

        {callOuts.length > 0 && <DetailedCallOutHistory callOuts={callOuts} showDownloadButton />}
      </div>
    </DivisionLayout>
  );
}
