import React from 'react';
import Loading from '../../components/Loading';
import {CallOutTrendsChart} from '../../components';
import {dateTo_HH_MM_SS, dateTo_YYYY_MM_DD} from '../../lib/utils';
import {useDashboardData, UseDashboardData} from '../../hooks/useDashboardData';

export function DashboardStats(): React.JSX.Element {
  const {loading, adminData}: UseDashboardData = useDashboardData();

  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <>
          <div className="w-full h-auto flex flex-col md:flex-row justify-center items-stretch gap-4 mb-4 ">
            <div className="w-full min-w-[111px] bg-tertiary p-4 rounded-md drop-shadow-md ">
              <h2 className="text-lg font-medium underline underline-offset-4 mb-3">
                Total Call-Outs
              </h2>

              <h3 className="text-2xl font-bold">{adminData?.totalCallOuts}</h3>
            </div>
            <div className="w-full min-w-[243px] bg-tertiary p-4 rounded-md drop-shadow-md">
              <h2 className="text-lg font-medium underline underline-offset-4 mb-3">
                Top 5 Call-Out Reasons
              </h2>
              <ul>
                {adminData?.fiveMostFrequentCallOutReasons?.map(([reason, count]) => (
                  <li key={reason} className="text-lg">
                    {reason}: {count}
                  </li>
                ))}
              </ul>
            </div>
            <div className="w-full min-w-[243px] bg-tertiary p-4 rounded-md drop-shadow-md">
              <h2 className="text-lg font-medium underline underline-offset-4 mb-3">
                Top 5 Frequent Callers
              </h2>
              <ul>
                {adminData?.fiveMostFrequentCallers?.map(([employee, count]) => (
                  <li key={employee} className="text-lg">
                    {employee}: {count}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="w-full flex flex-col gap-4 mb-4">
            <div className="bg-tertiary p-4 rounded-md drop-shadow-md">
              <h2 className="text-lg font-medium mb-4 underline underline-offset-4 ">
                Call-Outs Within The Last Twelve Hours
              </h2>
              <div className="flex flex-row w-auto overflow-x-auto gap-8 p-2">
                {adminData?.callOutsWithinLastTwelveHours?.map(callout => {
                  return (
                    <div
                      key={callout.id}
                      className="border border-gray-200 dark:border-gray-700 rounded-md p-4 bg-secondary min-w-72 snap-center">
                      <p>
                        <strong>Employee:</strong> {callout?.employee?.name}
                      </p>
                      <p>
                        <strong>Callout Date:</strong> {dateTo_YYYY_MM_DD(callout?.callout_date)}
                      </p>
                      <p>
                        <strong>Callout Time:</strong> {dateTo_HH_MM_SS(callout?.callout_time)}
                      </p>
                      <p>
                        <strong>Leave Type:</strong> {callout?.leaveType?.reason}
                      </p>
                      <p>
                        <strong>Supervisor:</strong> {callout?.supervisor?.supervisor_info?.name}{' '}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="bg-tertiary p-4 rounded-md drop-shadow-md mb-6 w-full h-auto">
            <h2 className="text-lg font-medium mb-4 underline underline-offset-4 text-center">
              Callout Trends
            </h2>
            <CallOutTrendsChart callOutTrends={adminData?.callOutTrends} />
          </div>
        </>
      )}
    </>
  );
}
