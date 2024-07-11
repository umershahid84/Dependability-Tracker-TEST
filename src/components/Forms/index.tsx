import Form from './Form';
import LoginForm from './LoginForm';
import CallOutForm from './Callout';
import FormInput from './FormInput';
import FormAction from './FormAction';
import SignUpForm from './SignUpForm';

export type {FormInputProps} from './FormInput';
export type {FormActionProps} from './FormAction';

export {Form, FormInput, FormAction, LoginForm, SignUpForm, CallOutForm};

const Forms = {
  Form,
  LoginForm,
  FormInput,
  SignUpForm,
  FormAction,
  CallOutForm
};

export default Forms;
