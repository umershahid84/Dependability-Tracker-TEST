import {makeToast, ToastTypes} from '../../components';
import {ResetPasswordFormState} from '../../components/Forms/ResetPassword';

export async function ResetPassword(formState: ResetPasswordFormState): Promise<void> {
  try {
    const response = await fetch('/api/reset-password', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(formState)
    });
    const {error} = await response.json();

    if (!response.ok || error) {
      throw new Error(error ?? 'Failed to reset password');
    }

    makeToast({
      type: ToastTypes.Success,
      title: 'Password Reset',
      message: 'A credential-creation invite has been sent to your registered email.'
    });

    return await response.json();
  } catch (error) {
    makeToast({
      type: ToastTypes.Error,
      title: 'Password Reset',
      message: String(error)
    });

    return;
  }
}
