import {useEffect, useRef, useState} from 'react';
import {useIsMounted} from '../../../hooks';
import {ApiData} from '../../../lib/apiController';
import Loading from '../../../components/Loading';
import {dateTo_HH_MM_SS, dateTo_YYYY_MM_DD} from '../../../lib/utils';
import {AdminLayout, makeToast, ToastTypes} from '../../../components';
import {AdminDashboardData} from '../../../lib/apiController/admin/dashboard';

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

  return data;
};

export const handleCallOutUpdates = async (
  currentCount: number
): Promise<ApiData<AdminDashboardData> | null> => {
  const hasUpdates = await checkForCallOutUpdates(currentCount);

  if (!hasUpdates) return null;

  const adminData = await getAdminDashData();

  return adminData ?? null;
};

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

function CallOutChart({callOutTrends}: {callOutTrends: AdminDashboardData['callOutTrends']}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const chartRef = useRef<any>(null); // Using a ref to store the chart instance

  useEffect(() => {
    const createChart = async () => {
      const {Chart, registerables} = await import('chart.js/auto');
      Chart.register(...registerables);

      const buildMonthLabels = (months: string[]) => {
        return months.map(month => {
          const [year, _month] = month.split('-');
          return `${_month} ${year}`;
        });
      };

      const sortedByMonthArray = callOutTrends?.sort((a, b) => {
        if (a.year === b.year) {
          return months.indexOf(a.month) - months.indexOf(b.month);
        }
        return parseInt(a.year) - parseInt(b.year);
      });

      if (callOutTrends) {
        if (chartRef.current) {
          chartRef.current.destroy();
        }

        chartRef.current = new Chart(canvasRef.current as HTMLCanvasElement, {
          type: 'line',
          data: {
            labels: buildMonthLabels(
              sortedByMonthArray?.map(month => `${month.year}-${month.month}`) ?? []
            ),
            datasets: [
              {
                label: 'CallOuts',
                data: callOutTrends.map(month => month.count),
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1
              }
            ]
          },
          options: {
            responsive: true,
            scales: {
              y: {
                beginAtZero: true
              }
            }
          }
        });
      }
    };

    createChart();

    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
      }
    };
  }, [callOutTrends]);

  return <canvas ref={canvasRef}></canvas>;
}

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
  const [updateInterval, setUpdateInterval] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    isMounted &&
      (async () => {
        setLoading(true);
        const {data}: ApiData<AdminDashboardData> = await getAdminDashData();
        setAdminData(data ?? null);
        setLoading(false);
        if (!updateInterval) {
          const interval = setInterval(async () => {
            const updateData: ApiData<AdminDashboardData> | null = await handleCallOutUpdates(
              adminData?.totalCallOuts ?? data?.totalCallOuts ?? 0
            );
            updateData && setAdminData(updateData.data as AdminDashboardData);
          }, 30000);

          setUpdateInterval(interval);
        }
      })();

    return () => {
      if (updateInterval) {
        clearInterval(updateInterval);
        setUpdateInterval(null);
      }
    };

    //eslint-disable-next-line
  }, [isMounted]);

  return (
    <AdminLayout>
      <div className="container mx-auto mt-20 p-2 rounded-md">
        <div className="flex justify-between items-center bg-gray-800 p-4 rounded-md mb-4">
          <h1 className="text-xl font-semibold">Admin Dashboard</h1>
          <h2 className="text-lg font-medium bg-gray-900 rounded-md py-1 px-2 w-auto flex flex-row justify-between gap-2 items-center">
            <span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="size-6">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                />
              </svg>
            </span>
          </h2>
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
                  Callouts Within The Last Twelve Hours
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
              <CallOutChart callOutTrends={adminData?.callOutTrends} />
            </div>
          </>
        )}
      </div>
    </AdminLayout>
  );
}
