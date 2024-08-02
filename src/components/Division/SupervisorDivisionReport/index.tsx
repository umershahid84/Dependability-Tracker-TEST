export function SupervisorDivisionReport() {
  return (
    <>
      <h1 className="text-2xl font-semibold text-center mb-6">Reports</h1>

      <div className="w-full flex flex-col justify-center items-center p-3 mt-6 gap-12 ">
        <form
          id="report-form"
          className="w-full min-w-min max-w-3xl flex flex-col justify-start items-center bg-primary border border-bg-quaternary rounded-md">
          <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-2xl text-sm lg:text-base">
            <div className="flex flex-col">
              <label htmlFor="employeeName" className="font-medium mb-1">
                Employee Name:
              </label>
              <select
                name="employeeName"
                title="Employee Name"
                className="border p-2 bg-secondary rounded-md">
                <option value="-1">Any</option>
              </select>
            </div>

            <div className="flex flex-col">
              <label htmlFor="leaveType" className="font-medium mb-1">
                Leave Type:
              </label>
              <select
                name="leaveType"
                title="Leave Type"
                className="border p-2 bg-secondary rounded-md">
                <option value="-1">Any</option>
              </select>
            </div>

            <div className="flex flex-col">
              <label htmlFor="start-date" className="font-medium mb-1">
                Start Date:
              </label>
              <input
                type="date"
                name="start-date"
                title="Start Date"
                className="border p-2 bg-secondary rounded-md"
              />
            </div>

            <div className="flex flex-col">
              <label htmlFor="end-date" className="font-medium mb-1">
                End Date:
              </label>
              <input
                type="date"
                name="end-date"
                title="End Date"
                className="border p-2 bg-secondary rounded-md"
              />
            </div>
          </div>
          <button
            type="submit"
            id="generate-report"
            className="my-4 p-3 rounded-md  text-primary hover:scale-105 bg-slate-950 hover:bg-accent-primary drop-shadow-md">
            Run Report
          </button>
        </form>
      </div>
    </>
  );
}
