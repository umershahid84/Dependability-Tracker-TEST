import React from 'react';
import {CallOutForm, DivisionLayout} from '@/components';
import {getServerSidePropsForCallOutForm} from '@/lib/utils/server';

export const getServerSideProps = async (request: {req: Request}) =>
  getServerSidePropsForCallOutForm(request);

export default function EmployeeParkingPage(props: {employees: string; leaveTypes: string}) {
  return (
    <DivisionLayout>
      <div className="flex flex-col flex-wrap justify-center items-center gap-8">
        <h3 className="mt-8 text-2xl">
          <strong>Create CallOut</strong>
        </h3>
        <CallOutForm employees={props.employees} leaveTypes={props.leaveTypes} />
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
