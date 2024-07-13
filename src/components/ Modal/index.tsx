export function Modal() {
  return (
    <div className="fixed inset-0 z-50 overflow-auto bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-md shadow-lg relative w-full max-w-md">
        <span className="absolute top-4 right-4 text-gray-500 dark:text-gray-300 cursor-pointer hover:text-red-500 text-2xl">
          &times;
        </span>
        <h2 id="edit-modal-title" className="text-2xl font-bold mb-4">
          Add Employee
        </h2>

        <form id="addEmployeeForm" className="grid grid-cols-1 gap-4 w-full">
          <div className="w-full flex flex-col justify-start items-start">
            <label htmlFor="name" className="font-medium">
              Employee Name:
            </label>
            <input
              title="Name"
              type="text"
              name="name"
              className="border p-2 rounded-md w-full dark:bg-slate-800"
              required
            />
          </div>

          <div className="w-full flex flex-col justify-start items-start">
            <label htmlFor="addDivisions" className="font-medium">
              Assign Employee Division:
            </label>
            <select
              title="Add Divisions"
              name="addDivisions"
              className="border p-2 rounded-md w-full dark:bg-slate-800"
              required>
              <option value="-1">Assign All</option>
            </select>
          </div>

          <div className="w-full flex flex-col justify-start items-start">
            <label htmlFor="isAdmin" className="font-medium">
              Is Admin?
            </label>
            <div className="flex items-center space-x-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="isAdmin"
                  value="yes"
                  className="mr-2 h-4 w-4 text-blue-600 border-gray-300 rounded dark:bg-slate-800"
                />
                <span>Yes</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="isAdmin"
                  value="no"
                  checked
                  className="mr-2 h-4 w-4 text-blue-600 border-gray-300 rounded dark:bg-slate-800"
                />
                <span>No</span>
              </label>
            </div>
          </div>
          <div id="setRole" className="w-full flex flex-col justify-start items-start">
            <label htmlFor="isSupervisor" className="font-medium">
              Is Supervisor?
            </label>
            <div className="flex items-center space-x-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="isSupervisor"
                  value="yes"
                  className="mr-2 h-4 w-4 text-blue-600 border-gray-300 rounded dark:bg-slate-800"
                />
                <span>Yes</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="isSupervisor"
                  value="no"
                  checked
                  className="mr-2 h-4 w-4 text-blue-600 border-gray-300 rounded dark:bg-slate-800"
                />
                <span>No</span>
              </label>
            </div>
          </div>
          <div className="w-full flex justify-end">
            <button
              id="addModalSubmitBtn"
              type="button"
              className="bg-blue-500 text-white rounded-md py-2 px-4 hover:bg-blue-600">
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
