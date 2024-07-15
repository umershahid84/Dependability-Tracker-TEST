import Form from './Form';
import {FormLabel} from './FormLabel';
import LoginForm from './LoginForm';
import CallOutForm from './Callout';
import FormAction from './FormAction';
import SignUpForm from './SignUpForm';

import {DynamicOptions} from './DynamicOptions';
import {AddEmployeeForm} from './EmployeeModal';
import DynamicSortOptions from './DynamicSortOptions';
import FormInputWithErrors from './FormInputWithErrors';

export type {FormActionProps} from './FormAction';
export type {FormInputWithErrorsProps} from './FormInputWithErrors';

export * from './EmployeeModal';

export {
  Form,
  FormLabel,
  LoginForm,
  FormAction,
  SignUpForm,
  CallOutForm,
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
  CallOutForm,
  DynamicOptions,
  AddEmployeeForm,
  DynamicSortOptions,
  FormInputWithErrors
};

export default Forms;
