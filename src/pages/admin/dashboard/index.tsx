import {useEffect, useState} from 'react';
import {useIsMounted} from '../../../hooks';
import Loading from '../../../components/Loading';
import {ApiData} from '../../../lib/apiController';
import {dateTo_HH_MM_SS, dateTo_YYYY_MM_DD} from '../../../lib/utils';
import {AdminDashboardData} from '../../../lib/apiController/admin/dashboard';
import {AdminLayout, CallOutTrendsChart, makeToast, ToastTypes} from '../../../components';

export const checkForCallOutUpdates = async (currentCount: number): Promise<boolean> => {
  const response = await fetch('/api/admin/dashboard', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({currentCount})
  });

  if (!response.ok) {
    throw new Error('Failed to fetch data');
  }

  const {data} = await response.json();

  return data ?? false;
};

export const getAdminDashData = async () => {
  try {
    const response = await fetch('/api/admin/dashboard');

    if (!response.ok) {
      makeToast({
        type: ToastTypes.Error,
        title: 'Error',
        message: 'Failed to fetch data'
      });
    }

    const adminData = await response.json();
    return adminData;
  } catch (error) {
    makeToast({
      type: ToastTypes.Error,
      title: 'Error',
      message: 'Failed to fetch data'
    });
    return null;
  }
};

export default function AdminDashboardPage() {
  const isMounted = useIsMounted();
  const [loading, setLoading] = useState<boolean>(false);
  const [adminData, setAdminData] = useState<AdminDashboardData | null>(null);

  async function handleCallOutUpdates(): Promise<void> {
    const hasUpdates = await checkForCallOutUpdates(adminData?.totalCallOuts ?? 0);

    if (!hasUpdates) {
      setTimeout(handleCallOutUpdates, 49000);
      return;
    }

    const {data} = await getAdminDashData();

    data && setAdminData(data);
  }

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const {data}: ApiData<AdminDashboardData> = await getAdminDashData();
      setAdminData(data ?? null);
      setLoading(false);
    };

    if (isMounted) {
      fetchData();
    }

    //eslint-disable-next-line
  }, [isMounted]);

  useEffect(() => {
    if (adminData?.totalCallOuts && isMounted) {
      setTimeout(handleCallOutUpdates, 49000);
    }
    //eslint-disable-next-line
  }, [adminData?.totalCallOuts, isMounted]);

  return (
    <AdminLayout>
      <div className="container mx-auto mt-20 p-2 rounded-md">
        <div className="flex justify-between items-center bg-gray-800 p-4 rounded-md mb-4">
          <h1 className="text-xl font-semibold">Admin Dashboard</h1>
        </div>

        {loading ? (
          <Loading />
        ) : (
          <>
            <div className="flex flex-col md:flex-row justify-center items-stretch gap-4 mb-4">
              <div className="w-full md:w-[500px] bg-gray-800 p-4 rounded-md drop-shadow-md ">
                <h2 className="text-lg font-medium underline underline-offset-4 mb-3">
                  Total Call-Outs
                </h2>
                <p className="text-2xl">Total Call-Outs: {adminData?.totalCallOuts}</p>
              </div>
              <div className="w-full md:w-[500px] bg-gray-800 p-4 rounded-md drop-shadow-md">
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
              <div className="w-full md:w-[500px] bg-gray-800 p-4 rounded-md drop-shadow-md">
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
              <div className="bg-gray-800 p-4 rounded-md drop-shadow-md">
                <h2 className="text-lg font-medium mb-4 underline underline-offset-4 ">
                  Call-Outs Within The Last Twelve Hours
                </h2>
                <div className="flex flex-row w-auto overflow-x-auto gap-8 p-2">
                  {adminData?.callOutsWithinLastTwelveHours?.map(callout => {
                    return (
                      <div
                        key={callout.id}
                        className="border border-gray-200 dark:border-gray-700 rounded-md p-4 hover:bg-slate-100 dark:hover:bg-slate-700 min-w-72 snap-center">
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

            <div className="bg-gray-800 p-4 rounded-md drop-shadow-md mb-6">
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
