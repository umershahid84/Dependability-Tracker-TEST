// istanbul ignore file
import CallOut from './Callout';
import Employee from './Employee';
import Supervisor from './Supervisor';
import LoginCredential from './LoginCredential';
import Division, {DefaultDivisions} from './Division';
import LeaveType, {DefaultLeaveTypes} from './LeaveType';

CallOut.belongsTo(Employee, {
  foreignKey: 'employee_id',
  onDelete: 'CASCADE'
});

CallOut.belongsTo(Supervisor, {
  foreignKey: 'supervisor_id',
  as: 'supervisor',
  onDelete: 'CASCADE'
});

Supervisor.belongsTo(CallOut, {
  foreignKey: 'supervisor_id',
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

Employee.belongsTo(Supervisor, {
  foreignKey: 'employee_id',
  as: 'supervisor_info',
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
