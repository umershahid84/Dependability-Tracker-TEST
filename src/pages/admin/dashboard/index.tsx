import {AdminLayout} from '../../../components';

export default function AdminDashboardPage() {
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

        <div className="flex flex-col md:flex-row justify-center items-stretch gap-4 mb-4">
          <div className="w-full md:w-[500px] bg-gray-800 p-4 rounded-md drop-shadow-md ">
            <h2 className="text-lg font-medium underline underline-offset-4 mb-3">
              Total Callouts
            </h2>
            <p className="text-2xl">Total CallOuts</p>
          </div>
          <div className="w-full md:w-[500px] bg-gray-800 p-4 rounded-md drop-shadow-md">
            <h2 className="text-lg font-medium underline underline-offset-4 mb-3">
              Top 5 Callouts Reasons
            </h2>
            <ul></ul>
          </div>
          <div className="w-full md:w-[500px] bg-gray-800 p-4 rounded-md drop-shadow-md">
            <h2 className="text-lg font-medium underline underline-offset-4 mb-3">
              Top 5 Frequent Callers
            </h2>
            <ul></ul>
          </div>
        </div>
        <div className="w-full flex flex-col gap-4 mb-4">
          <div className="bg-gray-800 p-4 rounded-md drop-shadow-md">
            <h2 className="text-lg font-medium mb-4 underline underline-offset-4 ">
              Callouts Within The Last Twelve Hours
            </h2>
            <div className="flex flex-row w-auto overflow-x-auto gap-8 p-2"></div>
          </div>
        </div>

        <div className="bg-gray-800 p-4 rounded-md drop-shadow-md mb-6">
          <h2 className="text-lg font-medium mb-4 underline underline-offset-4 text-center">
            Callout Trends
          </h2>
          <canvas id="calloutTrendsChart"></canvas>
        </div>
      </div>
    </AdminLayout>
  );
}
