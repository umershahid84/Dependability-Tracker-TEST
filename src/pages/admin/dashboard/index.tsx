import { useIsMounted } from '../../../hooks';
import { useEffect, useState, useRef } from 'react';
import Loading from '../../../components/Loading';
import { ApiData } from '../../../lib/apiController';
import { CallOutWithAssociations } from '../../../lib/db/models/Callout';
import { AdminDashboardData } from '../../../lib/apiController/admin/dashboard';
import { dateTo_HH_MM_SS, dateTo_YYYY_MM_DD, makeDate } from '../../../lib/utils';
import { AdminLayout, CallOutTrendsChart, makeToast, ToastTypes } from '../../../components';

export const checkForCallOutUpdates = async (currentCount: number): Promise<boolean> => {
  const response = await fetch('/api/admin/dashboard', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ currentCount })
  });

  if (!response.ok) {
    throw new Error('Failed to fetch data');
  }

  const { data } = await response.json();

  return data ?? false;
};

export const getAdminDashData = async (): Promise<AdminDashboardData | null> => {
  try {
    const response = await fetch('/api/admin/dashboard');

    if (!response.ok) {
      makeToast({
        type: ToastTypes.Error,
        title: 'Error',
        message: 'Failed to fetch data'
      });
    }

    const adminData: ApiData<AdminDashboardData> = await response.json();
    return adminData.data ?? null;
  } catch (error) {
    makeToast({
      type: ToastTypes.Error,
      title: 'Error',
      message: 'Failed to fetch data'
    });
    return null;
  }
};

export const getAdminDataUpdates = async (
  latestCallOuts: CallOutWithAssociations[]
): Promise<CallOutWithAssociations[]> => {
  try {
    // find the latest callout time
    let latestCallOutTime = makeDate('1970-01-01T00:00:00.000Z');

    latestCallOuts.forEach(callout => {
      const callOutTime = makeDate(callout.callout_date);

      if (callOutTime > latestCallOutTime) {
        latestCallOutTime = callOutTime;
      }
    });

    const baseURL = '/api/admin/dashboard/update';
    const query = `?calloutDate=${latestCallOutTime.toISOString()}`;

    const uRL = `${baseURL}${query}`;

    const response = await fetch(uRL, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (!response) {
      throw new Error('Failed to fetch data');
    }

    const { data }: ApiData<CallOutWithAssociations[]> = await response.json();

    return data ?? [];
  } catch (error) {
    const errMessage = 'Error in getAdminDataUpdates:' + ' ' + error;
    console.error(errMessage);
    return [];
  }
};

export default function AdminDashboardPage(/*props: Readonly<{data: AdminDashboardData | null}>*/) {
  const isMounted = useIsMounted();
  const updateCountRef = useRef<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const adminDataRef = useRef<AdminDashboardData | null>(null);
  const [adminData, setAdminData] = useState<AdminDashboardData | null>(null);

  async function handleCallOutUpdates(): Promise<void> {
    const hasUpdates = await checkForCallOutUpdates(adminDataRef?.current?.totalCallOuts ?? 0);

    if (!hasUpdates) {
      return;
    }

    if (updateCountRef.current < 5 && adminDataRef.current && hasUpdates) {
      const data: CallOutWithAssociations[] = await getAdminDataUpdates(
        adminDataRef?.current?.callOutsWithinLastTwelveHours ?? []
      );

      if (data) {
        const newAdminData = { ...adminDataRef.current };
        for (const callout of data) {
          // only process the callout if it isn't already in the list
          const callOutIndex = newAdminData?.callOutsWithinLastTwelveHours?.findIndex(
            ({ id }) => id === callout.id
          );

          if (callOutIndex !== -1) {
            continue;
          }

          const reason = callout?.leaveType?.reason;
          const employee = callout?.employee?.name;

          // if the callout reason is in the top 5 frequent callout reasons list increment the count
          const callOutReasonIndex = newAdminData?.fiveMostFrequentCallOutReasons?.findIndex(
            ([reason]) => reason === reason
          );

          if (newAdminData?.fiveMostFrequentCallOutReasons && callOutReasonIndex !== -1) {
            if (newAdminData?.fiveMostFrequentCallOutReasons && callOutReasonIndex !== -1) {
              newAdminData.fiveMostFrequentCallOutReasons[callOutReasonIndex as number][1]++;
            }
          } else {
            newAdminData?.fiveMostFrequentCallOutReasons?.push([reason, 1]);
          }

          // if the employee is in the top 5 frequent callers list increment the count
          const employeeIndex = newAdminData?.fiveMostFrequentCallers?.findIndex(
            ([employee]) => employee === employee
          );

          if (newAdminData?.fiveMostFrequentCallers && employeeIndex !== -1) {
            newAdminData.fiveMostFrequentCallers[employeeIndex as number][1]++;
          } else {
            newAdminData?.fiveMostFrequentCallers?.push([employee, 1]);
          }

          // update the callout trends
          const months = [
            'January',
            'February',
            'March',
            'April',
            'May',
            'June',
            'July',
            'August',
            'September',
            'October',
            'November',
            'December'
          ];

          const callOutMonth = months[new Date(callout.callout_date).getMonth()];
          const callOutYear = String(new Date(callout.callout_date).getFullYear());

          // find the index of the month and year in the callout trends

          const matchingMonthIndex = newAdminData?.callOutTrends?.findIndex(({ month, year }) => {
            return month === callOutMonth && year === callOutYear;
          });

          if (matchingMonthIndex !== -1) {
            if (newAdminData?.callOutTrends) {
              newAdminData.callOutTrends[matchingMonthIndex as number].count++;
            }
          } else {
            newAdminData?.callOutTrends?.push({ month: callOutMonth, year: callOutYear, count: 1 });
          }

          const twelveHoursAgo = new Date();
          twelveHoursAgo.setHours(twelveHoursAgo.getHours() - 12);

          if (new Date(callout.callout_date) > twelveHoursAgo) {
            newAdminData?.callOutsWithinLastTwelveHours?.unshift(callout);
          }

          if (newAdminData.totalCallOuts) {
            newAdminData.totalCallOuts++;
          } else {
            newAdminData.totalCallOuts = 1;
          }
        }

        // update the admin data
        adminDataRef.current = { ...newAdminData };
        setAdminData(newAdminData);

        // update the update count ref
        updateCountRef.current++;
      }
    }

    if (updateCountRef.current >= 5 && hasUpdates) {
      // if there have been more than 5 updates, we need to fetch the entire data again to ensure we are
      // not missing any edits and to ensure the top-5's are truly accurate
      const data = await getAdminDashData();

      if (data) {
        adminDataRef.current = data;
        updateCountRef.current = 0;
      }
    }
  }

  useEffect(() => {
    adminDataRef.current && setAdminData(adminDataRef.current);
    // eslint-disable-next-line
  }, [adminDataRef.current]);

  useEffect(() => {
    if (!intervalRef.current && isMounted) {
      getAdminDashData().then(data => {
        if (data) {
          adminDataRef.current = data;
          setLoading(false);

          const oneMinute = 45000;
          intervalRef.current = setInterval(handleCallOutUpdates, oneMinute);
        }
      });
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMounted]);

  return (
    <AdminLayout>
      <div className="container mx-auto mt-8 p-2 rounded-md">
        <div className="flex justify-between items-center bg-tertiary p-4 rounded-md mb-4">
          <h1 className="text-xl font-semibold">Admin Dashboard</h1>
        </div>

        {loading ? (
          <Loading />
        ) : (
          <>
            <div className="flex flex-col md:flex-row justify-center items-stretch gap-4 mb-4">
              <div className="w-auto min-w-[175px] bg-tertiary p-4 rounded-md drop-shadow-md ">
                <h2 className="text-lg font-medium underline underline-offset-4 mb-3">
                  Total Call-Outs
                </h2>

                <h3 className="text-2xl font-bold">{adminData?.totalCallOuts}</h3>
              </div>
              <div className="w-full  bg-tertiary p-4 rounded-md drop-shadow-md">
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
              <div className="w-full  bg-tertiary p-4 rounded-md drop-shadow-md">
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

            <div className="bg-tertiary p-4 rounded-md drop-shadow-md mb-6">
              <h2 className="text-lg font-medium mb-4 underline underline-offset-4 text-center">
                Callout Trends
              </h2>
              <CallOutTrendsChart callOutTrends={adminData?.callOutTrends} />
            </div>
          </>
        )}
      </div>
    </AdminLayout>
  );
}
