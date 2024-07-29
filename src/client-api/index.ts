import {getDivisions} from './get-divisions';
import {getLeaveTypes} from './get-leaveTypes';
import {DeleteCallOut, EditCallOut, GetCallOuts} from './callouts';
import {
  GetSupervisors,
  Login,
  Logout,
  ResetPassword,
  SignUp,
  getJwtTokenInEdgeEnvironments
} from './supervisors';

import {
  GetEmployees,
  EditEmployee,
  CreateEmployee,
  DeleteEmployee,
  CreateEmployeeCallOut
} from './employees';

export * from './employees';
export * from './supervisors';
export * from './get-divisions';
export * from './get-leaveTypes';

export type ClientAPI = typeof ClientAPI;

export const ClientAPI = {
  Employees: {
    Create: CreateEmployee,
    Read: GetEmployees,
    Update: EditEmployee,
    Delete: DeleteEmployee,
    CallOuts: {Create: CreateEmployeeCallOut}
  },
  Divisions: {Read: getDivisions},
  LeaveTypes: {Read: getLeaveTypes},
  CallOuts: {
    Create: CreateEmployeeCallOut,
    Read: GetCallOuts,
    Update: EditCallOut,
    Delete: DeleteCallOut
  },
  Supervisors: {
    Login,
    Logout,
    SignUp,
    ResetPassword,
    Read: GetSupervisors,
    VerifyToken: getJwtTokenInEdgeEnvironments
  }
};
