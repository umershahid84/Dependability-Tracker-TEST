// istanbul ignore file
import CallOut from './Callout';
import Employee from './Employee';
import Supervisor from './Supervisor';
import LoginCredential from './LoginCredential';
import Division, {DefaultDivisions} from './Division';
import LeaveType, {DefaultLeaveTypes} from './LeaveType';
import CreateCredentialsInvite from './CreateCredentialsInvite';
import EmployeeSchedule from './EmployeeSchedule';

CallOut.belongsTo(Employee, {
  foreignKey: 'employee_id',
  onDelete: 'CASCADE'
});

CallOut.belongsTo(Supervisor, {
  foreignKey: 'supervisor_id',
  as: 'supervisor',
  onDelete: 'CASCADE'
});

CallOut.belongsTo(Employee, {
  foreignKey: 'employee_id',
  onDelete: 'CASCADE'
});

CallOut.belongsTo(LeaveType, {
  foreignKey: 'leave_type_id',
  as: 'leaveType'
});

Employee.hasMany(CallOut, {
  sourceKey: 'id',
  foreignKey: 'employee_id',
  as: 'callouts'
});

Employee.hasMany(EmployeeSchedule, {
  sourceKey: 'id',
  foreignKey: 'employee_id',
  as: 'schedules'
});

EmployeeSchedule.belongsTo(Employee, {
  foreignKey: 'employee_id',
  as: 'employee',
  onDelete: 'CASCADE'
});

LoginCredential.belongsTo(Supervisor, {
  foreignKey: 'supervisor_id',
  as: 'supervisor_info',
  onDelete: 'CASCADE'
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

CreateCredentialsInvite.belongsTo(Supervisor, {
  foreignKey: 'supervisor_id',
  as: 'supervisor_info',
  onDelete: 'CASCADE'
});

CreateCredentialsInvite.belongsTo(Supervisor, {
  foreignKey: 'created_by',
  as: 'created_by_info',
  onDelete: 'CASCADE'
});

Supervisor.hasOne(CreateCredentialsInvite, {
  sourceKey: 'id',
  foreignKey: 'supervisor_id',
  as: 'create_credentials_invite',
  onDelete: 'CASCADE'
});

Supervisor.hasMany(CreateCredentialsInvite, {
  sourceKey: 'id',
  foreignKey: 'created_by',
  as: 'created_by_info',
  onDelete: 'CASCADE'
});

const models = {
  CallOut,
  Division,
  Employee,
  LeaveType,
  Supervisor,
  EmployeeSchedule,
  LoginCredential,
  CreateCredentialsInvite
};

export default models;

export {
  CallOut,
  Division,
  Employee,
  LeaveType,
  Supervisor,
  EmployeeSchedule,
  LoginCredential,
  DefaultDivisions,
  DefaultLeaveTypes,
  CreateCredentialsInvite
};
