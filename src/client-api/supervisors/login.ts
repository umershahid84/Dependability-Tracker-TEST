import {NextRouter} from 'next/router';
import {makeToast, ToastTypes} from '../../components';

export type LoginFormState = {
  email: string;
  password: string;
};

export type LoginProps = {
  router: NextRouter;
  formState: LoginFormState;
  setHasError: React.Dispatch<React.SetStateAction<boolean>>;
  setFormState: React.Dispatch<React.SetStateAction<LoginFormState>>;
};

export const defaultLoginFormState: LoginFormState = {email: '', password: ''};

export const Login = async ({
  router,
  formState,
  setHasError,
  setFormState
}: LoginProps): Promise<void> => {
  try {
    const response = await fetch('/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formState)
    });

    if (!response.ok) {
      throw new Error('Unauthorized request');
    } else {
      const data = await response.json();

      makeToast({
        title: 'Success',
        type: ToastTypes.Success,
        message: data.message,
        timeOut: 1500
      });

      // reset the form and redirect to the dashboard

      setTimeout(() => {
        router.push('/dashboard');
        setFormState(defaultLoginFormState);
      }, 250);
    }
  } catch (error) {
    setHasError(true);
    makeToast({
      title: 'Error',
      type: ToastTypes.Error,
      message: 'There was an error logging into your account. Please try again.',
      timeOut: 7500
    });
  }
};
