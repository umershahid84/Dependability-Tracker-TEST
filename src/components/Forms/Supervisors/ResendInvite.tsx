import { useState } from 'react';
import Loading from '../../Loading';
import { WarningIcon } from '../../Icons';
import { ModalAction } from '../../Modal';
import { validators } from '../../../lib/utils';
import { makeToast, ToastTypes } from '../../Toasts';
import { ApiData } from '../../../lib/apiController';
import FormInputWithErrors from '../FormInputs/FormInputWithErrors';
import { SupervisorWithAssociations } from '../../../lib/db/models/Supervisor';

const styles = {
  buttonsContainer: 'mt-6 flex flex-row gap-20',
  h2: `text-2xl font-bold mb-2 text-cyan-400 -mt-2`,
  div: `w-full flex flex-col items-center justify-center`,
  headingSpan: 'w-full flex flex-row justify-start items-center gap-2'
};

export function ResendCreateCredentialInviteByEmail({
  supervisor,
  onModalEditCallBack
}: Readonly<{
  supervisor: SupervisorWithAssociations;
  onModalEditCallBack: (supervisor: SupervisorWithAssociations) => void;
}>) {
  const [email, setEmail] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [emailError, setEmailError] = useState<string | null>(null);

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    verifyEmail(e.target.value);
  };

  const verifyEmail = (email: string): boolean => {
    const isValid = validators.isEmail(email);
    setEmailError(isValid ? null : 'Invalid Email Address');
    return isValid;
  };

  const resendInviteByEmail = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/supervisors/credential-invite/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          supervisorsEmail: email,
          forSupervisor: supervisor.id
        })
      });

      const data: ApiData<SupervisorWithAssociations> = await response.json();

      if (!response.ok) {
        throw new Error(data?.error ?? 'Error resetting credentials');
      }

      makeToast({
        title: 'Success',
        type: ToastTypes.Success,
        message: 'Invite sent to ' + email
      });

      setLoading(false);
      onModalEditCallBack(data.data as SupervisorWithAssociations);
      window.dispatchEvent(new CustomEvent('modalEvent', { detail: { action: ModalAction.CLOSE } }));
    } catch (error) {
      console.error('Error creating invite: ', error);
      makeToast({
        type: ToastTypes.Error,
        title: 'Error',
        message: String(error)
      });

      setLoading(false);
    }
  };

  const handleClick = (e: React.SyntheticEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();

    const textValue = e.currentTarget.textContent;

    switch (textValue) {
      case 'Resend Invite':
        resendInviteByEmail();
        break;
      case 'Cancel':
        window.dispatchEvent(new CustomEvent('modalEvent', { detail: { action: ModalAction.CLOSE } }));
        break;
      default:
        break;
    }
  };

  return (
    <div className={styles.div}>
      <h2 className={styles.h2}>
        <span className={styles.headingSpan}>
          <WarningIcon className="w-8 h-8 stroke-2" /> Resend Invite
        </span>
      </h2>

      {!loading ? (
        <>
          <FormInputWithErrors
            required
            id="email"
            type="text"
            gap="mt-2"
            value={email}
            label="Supervisor's Email"
            onChange={handleEmailChange}
            errors={[emailError as string]}
            placeholder="Valid Work Email"
            className={`w-full p-2 rounded-md bg-tertiary ring-1 ring-gray-300 focus:ring-2 focus:outline-none  ${emailError ? 'ring-red-500' : 'focus:ring-gray-300'
              }`}
          />

          <div className={styles.buttonsContainer}>
            <button
              type="button"
              disabled={emailError != null}
              className={`px-2 py-1 bg-quinary ${emailError === null && email.length > 0
                ? 'hover:bg-accent-primary'
                : 'cursor-not-allowed'
                } text-primary rounded mr-2 Text-outline-hover`}
              onClick={handleClick}>
              Resend Invite
            </button>
            <button
              type="button"
              className="px-2 py-1 bg-quinary hover:bg-red-600 text-primary rounded mr-2"
              onClick={handleClick}>
              Cancel
            </button>
          </div>
        </>
      ) : (
        <Loading />
      )}
    </div>
  );
}
