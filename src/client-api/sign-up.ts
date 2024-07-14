import {NextRouter} from 'next/router';
import {makeToast, ToastTypes} from '../components';

export type SignUpFormState = {
  password: string | null;
  email: string | null;
  confirmPassword: string | null;
};

export const defaultSignUpFormState: SignUpFormState = {
  email: '',
  password: '',
  confirmPassword: ''
};

export type SignUpProps = {
  router: NextRouter;
  token: string;
  inviteId: string;
  formState: SignUpFormState;
  setHasError: React.Dispatch<React.SetStateAction<boolean>>;
  setFormState: React.Dispatch<React.SetStateAction<SignUpFormState>>;
};

export const SignUp = async ({
  token,
  router,
  inviteId,
  formState,
  setHasError,
  setFormState
}: SignUpProps) => {
  try {
    const response = await fetch('/api/sign-up', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: formState.email,
        password: formState.password,
        inviteToken: token,
        inviteId: inviteId
      })
    });

    if (!response.ok) {
      makeToast({
        title: 'Error',
        type: ToastTypes.Error,
        message: 'There was an error creating your account. Please try again.',
        timeOut: 7500
      });
    } else {
      const data = await response.json();

      makeToast({
        title: 'Success',
        type: ToastTypes.Success,
        message: data.message
      });

      // reset the form and redirect to the dashboard
      setFormState(defaultSignUpFormState);
      setTimeout(() => {
        router.push('/dashboard');
      }, 800);
    }
  } catch (error) {
    console.error(error);
    setHasError(true);
  }
};
