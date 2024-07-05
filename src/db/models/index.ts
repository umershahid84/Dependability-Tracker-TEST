// istanbul ignore file
import CallOut from './Callout';
import Employee from './Employee';
import Supervisor from './Supervisor';
import LoginCredential from './LoginCredential';
import Division, {DefaultDivisions} from './Division';
import LeaveType, {DefaultLeaveTypes} from './LeaveType';

// configure associations
// CallOut belongs to Employee through the employee_id foreign key
// CallOut belongs to Supervisor through the supervisor_id foreign key
// CallOut belongs to LeaveType through the leave_type_id foreign key
// Employee has many CallOuts through the employee_id foreign key
// Supervisor belongs to Employee through the employee_id foreign key
// Supervisor has one LoginCredential through the supervisor_id foreign key
CallOut.belongsTo(Employee, {
  foreignKey: 'employee_id'
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

Employee.belongsTo(Supervisor, {
  foreignKey: 'employee_id',
  as: 'supervisor_info',
  onDelete: 'CASCADE'
});

LoginCredential.belongsTo(Supervisor, {
  foreignKey: 'supervisor_id',
  as: 'supervisor_info'
});

Supervisor.belongsTo(Employee, {
  foreignKey: 'employee_id',
  as: 'supervisor_info',
  onDelete: 'CASCADE'
});

Supervisor.hasOne(LoginCredential, {
  foreignKey: 'supervisor_id',
  as: 'login_credentials',
  onDelete: 'CASCADE'
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
