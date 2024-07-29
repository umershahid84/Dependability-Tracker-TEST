import Form from './Form';
import LoginForm from './LoginForm';
import {FormLabel} from './FormInputs/FormLabel';
import FormAction from './FormAction';
import SignUpForm from './SignUpForm';
import {DynamicOptions} from './FormInputs/DynamicOptions';
import {AddEmployeeForm} from './EmployeeModal';
import DynamicSortOptions from './FormInputs/DynamicSortOptions';
import FormInputWithErrors from './FormInputs/FormInputWithErrors';

export type {FormActionProps} from './FormAction';
export type {FormInputWithErrorsProps} from './FormInputs/FormInputWithErrors';

export * from './CallOut';
export * from './EmployeeModal';
export * from './ResetPassword';

export {
  Form,
  FormLabel,
  LoginForm,
  FormAction,
  SignUpForm,
  DynamicOptions,
  AddEmployeeForm,
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
  DynamicSortOptions,
  FormInputWithErrors
};

export default Forms;
