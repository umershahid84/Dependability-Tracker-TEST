import { makeToast, ToastTypes } from '../../components';
import { ResetPasswordFormState } from '../../components/Forms/ResetPassword';

export async function ResetPasswordRequest(formState: ResetPasswordFormState): Promise<void> {
  try {
    const response = await fetch('/api/reset-password/request', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formState)
    });
    const payload = await response.json();
    const error = payload?.error;

    if (!response.ok || error) {
      throw new Error(error ?? 'Failed to request password reset');
    }

    makeToast({
      type: payload?.emailSent === false ? ToastTypes.Warning : ToastTypes.Success,
      title: 'Password Reset',
      message: payload?.message ?? 'A reset code has been sent to your registered email.'
    });

    return;
  } catch (error) {
    makeToast({
      type: ToastTypes.Error,
      title: 'Password Reset',
      message: String(error)
    });

    return;
  }
}

export async function ResetPasswordConfirm({ email, code, password }: { email: string; code: string; password: string }): Promise<void> {
  try {
    const response = await fetch('/api/reset-password/confirm', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, code, password })
    });
    const payload = await response.json();
    const error = payload?.error;

    if (!response.ok || error) {
      throw new Error(error ?? 'Failed to confirm password reset');
    }

    makeToast({
      type: ToastTypes.Success,
      title: 'Password Reset',
      message: payload?.message ?? 'Password has been updated.'
    });

    return;
  } catch (error) {
    makeToast({
      type: ToastTypes.Error,
      title: 'Password Reset',
      message: String(error)
    });

    return;
  }
}
