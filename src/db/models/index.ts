import CallOut from './Callout';
import Employee from './Employee';
import Supervisor from './Supervisor';
import LoginCredential from './LoginCredential';
import Division, {DefaultDivisions} from './Division';
import LeaveType, {DefaultLeaveTypes} from './LeaveType';

// configure associations
CallOut.belongsTo(Employee, {
  foreignKey: 'employee_id',
  as: 'employee'
});

CallOut.belongsTo(Supervisor, {
  foreignKey: 'supervisor_id',
  as: 'supervisor'
});

CallOut.belongsTo(LeaveType, {
  foreignKey: 'leave_type_id',
  as: 'leaveType'
});

Employee.hasMany(CallOut, {
  sourceKey: 'id',
  foreignKey: 'employee_id',
  as: 'callOuts'
});

LoginCredential.belongsTo(Supervisor, {
  foreignKey: 'supervisor_id',
  as: 'supervisor_info'
});

Supervisor.belongsTo(Employee, {
  foreignKey: 'employee_id',
  as: 'supervisor_info'
});

Supervisor.hasOne(LoginCredential, {
  foreignKey: 'supervisor_id',
  as: 'login_credentials'
});

const models = {
  CallOut,
  Division,
  Employee,
  LeaveType,
  Supervisor,
  LoginCredential
};

export default models;

export {
  CallOut,
  Division,
  Employee,
  LeaveType,
  Supervisor,
  LoginCredential,
  DefaultDivisions,
  DefaultLeaveTypes
};
