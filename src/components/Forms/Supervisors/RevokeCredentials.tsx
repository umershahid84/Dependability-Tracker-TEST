import { useState } from 'react';
import Loading from '../../Loading';
import { WarningIcon } from '../../Icons';
import { ModalAction } from '../../Modal';
import { makeToast, ToastTypes } from '../../Toasts';
import { ApiData } from '../../../lib/apiController';
import FormInputWithErrors from '../FormInputs/FormInputWithErrors';
import { SupervisorWithAssociations } from '../../../lib/db/models/Supervisor';

const styles = {
  buttonsContainer: 'mt-6 flex flex-row gap-2',
  h2: `text-2xl font-bold mb-2 text-amber-600 -mt-2`,
  div: `w-full flex flex-col items-center justify-center`,
  headingSpan: 'w-full flex flex-row justify-start items-center gap-2'
};

export function RevokeCredentials({
  supervisor,
  onModalEditCallBack
}: Readonly<{
  supervisor: SupervisorWithAssociations;
  onModalEditCallBack: (supervisor: SupervisorWithAssociations) => void;
}>) {
  const [password, setPassword] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [validPassword, setValidPassword] = useState<boolean>(true);

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    setValidPassword(e.target.value.length >= 8);
  };

  const revokeCredentials = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/admin/supervisors/login-credentials/revoke`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ forSupervisor: supervisor.id, password })
      });

      const data: ApiData<SupervisorWithAssociations> = await response.json();

      if (!response.ok || !data) {
        throw new Error(data.error ?? 'Unable to reset credentials');
      } else {
        makeToast({
          type: ToastTypes.Success,
          title: 'Success',
          message: `Credentials Revoked Successfully`
        });

        setLoading(false);
        onModalEditCallBack(data.data as SupervisorWithAssociations);
        window.dispatchEvent(new CustomEvent('modalEvent', { detail: { action: ModalAction.CLOSE } }));
      }
    } catch (error) {
      console.error('Error revoking supervisor credentials');
      makeToast({
        type: ToastTypes.Error,
        title: 'Error',
        message: String(error)
      });
      setLoading(false);
    }
  };

  const handleClick = async (e: React.SyntheticEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();

    const textValue = e.currentTarget.textContent;

    switch (textValue) {
      case 'Revoke Credentials':
        await revokeCredentials();
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
          <WarningIcon className="w-8 h-8 stroke-2" /> Revoke Credentials
        </span>
      </h2>
      <p className="my-3">This is an irreversible action!</p>

      {!loading ? (
        <>
          <FormInputWithErrors
            required
            gap="mt-2"
            id="password"
            type="password"
            value={password}
            label="Admin Password"
            onChange={handlePasswordChange}
            placeholder="Current Admin's Password"
            errors={!validPassword ? ['Password must be at least 8 characters'] : []}
            className={`w-full p-2 rounded-md bg-tertiary ring-1 ring-gray-300 focus:ring-2 focus:outline-none  ${!validPassword ? 'ring-red-500' : 'focus:ring-gray-300'
              }`}
          />

          <div className={styles.buttonsContainer}>
            <button
              type="button"
              className="px-2 py-1 bg-quinary hover:bg-red-500 text-primary rounded mr-2"
              onClick={handleClick}>
              Revoke Credentials
            </button>
            <button
              type="button"
              className="px-2 py-1 bg-quinary hover:bg-quaternary text-primary rounded mr-2"
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
