import {
  UseDivisions,
  useDivisions,
  useLeaveTypes,
  UseLeaveTypes,
  useGetEmployees,
  UseGetEmployees,
  useGetSupervisors,
  UseGetSupervisors
} from '../hooks';
import {DivisionAttributes} from '../lib/db/models/Division';
import {EmployeeWithAssociations} from '../lib/db/controller';
import {LeaveTypeAttributes} from '../lib/db/models/LeaveType';
import {SupervisorWithAssociations} from '../lib/db/models/Supervisor';
import {GetAllCallOutOptions} from '../lib/db/controller/Callout/helpers';
import {dbSearchParams} from '../components/CallOuts/CallOutsList/helpers';
import {Context, useContext, useState, createContext, PropsWithChildren, useEffect} from 'react';

export type CallOutAdvancedSearchContext = {
  executeSearch: boolean;
  searchParams: GetAllCallOutOptions;
  divisions: DivisionAttributes[];
  leaveTypes: LeaveTypeAttributes[];
  employees: EmployeeWithAssociations[];
  supervisors: SupervisorWithAssociations[];
  setExecuteSearch: React.Dispatch<React.SetStateAction<boolean>>;
  setSearchParams: React.Dispatch<React.SetStateAction<GetAllCallOutOptions>>;
  handleSearchParamsChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
};

const CallOutAdvancedSearchContext: Context<CallOutAdvancedSearchContext> =
  createContext<CallOutAdvancedSearchContext>({} as CallOutAdvancedSearchContext);

const {Provider}: Context<CallOutAdvancedSearchContext> = CallOutAdvancedSearchContext;

export const CallOutAdvancedSearchProvider = (props: PropsWithChildren): React.JSX.Element => {
  const {divisions}: UseDivisions = useDivisions();
  const {leaveTypes}: UseLeaveTypes = useLeaveTypes();
  const {employees}: UseGetEmployees = useGetEmployees();
  const {supervisors}: UseGetSupervisors = useGetSupervisors();
  const [executeSearch, setExecuteSearch] = useState<boolean>(false);
  const [employeesData, setEmployeesData] = useState<EmployeeWithAssociations[]>([]);
  const [searchParams, setSearchParams] = useState<GetAllCallOutOptions>(dbSearchParams);
  const [showSelectedOptionsHeader, setShowSelectedOptionsHeader] = useState<boolean>(false);

  useEffect(() => {
    if (employees?.data) {
      setEmployeesData(employees.data);
    }
  }, [employees]);

  const handleSearchParamsChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setSearchParams({
      ...searchParams,
      [e.target.name]: e.target.value === '' ? undefined : e.target.value
    });
    setExecuteSearch(false);
  };

  useEffect(() => {
    // if all the params are undefined, hide the selected options header
    const hasParams = Object.values(searchParams).some(value => value !== undefined);
    if (!hasParams) {
      setShowSelectedOptionsHeader(false);
    }
  }, [showSelectedOptionsHeader, searchParams]);

  return (
    <Provider
      value={{
        searchParams,
        executeSearch,
        setSearchParams,
        setExecuteSearch,
        handleSearchParamsChange,
        divisions: divisions ?? [],
        leaveTypes: leaveTypes ?? [],
        employees: employeesData ?? [],
        supervisors: supervisors?.data ?? []
      }}
      {...props}
    />
  );
};

export const useCallOutAdvancedSearchContext = (): CallOutAdvancedSearchContext =>
  useContext(CallOutAdvancedSearchContext);
