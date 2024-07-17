import Form from './Form';
import LoginForm from './LoginForm';
import {FormLabel} from './FormLabel';
import FormAction from './FormAction';
import SignUpForm from './SignUpForm';
import CreateCallOutForm from './CreateCallOut';
import {DynamicOptions} from './DynamicOptions';
import {AddEmployeeForm} from './EmployeeModal';
import DynamicSortOptions from './DynamicSortOptions';
import FormInputWithErrors from './FormInputWithErrors';

export type {FormActionProps} from './FormAction';
export type {FormInputWithErrorsProps} from './FormInputWithErrors';

export * from './EmployeeModal';
export * from './CallOutsModal';

export {
  Form,
  FormLabel,
  LoginForm,
  FormAction,
  SignUpForm,
  DynamicOptions,
  AddEmployeeForm,
  CreateCallOutForm,
  DynamicSortOptions,
  FormInputWithErrors
};

const Forms = {
  Form,
  FormLabel,
  LoginForm,
  SignUpForm,
  FormAction,

  DynamicOptions,
  AddEmployeeForm,
  CreateCallOutForm,
  DynamicSortOptions,
  FormInputWithErrors
};

export default Forms;
