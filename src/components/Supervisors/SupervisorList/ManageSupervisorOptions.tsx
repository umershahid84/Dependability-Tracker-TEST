import {ModalAction, ModalType} from '../../ Modal';
import type {SupervisorWithAssociations} from '../../../lib/db/models/types';

const styles = {
  resetPassword: 'hover:bg-red-500',
  sendInvite: 'hover:bg-indigo-500',
  optionsContainer: 'mt-3 flex flex-wrap flex-row gap-6',
  button: 'px-2 py-1 bg-slate-700 text-white rounded mr-2'
};

export function ManageSupervisorOptions({
  supervisor
}: Readonly<{
  supervisor: SupervisorWithAssociations;
}>): React.ReactElement {
  const hasCredentials: boolean = Boolean(supervisor.login_credentials);
  const hasCreateCredentialsInvite: boolean = Boolean(supervisor.create_credentials_invite);
  const needsInvite: boolean = Boolean(!hasCredentials && !hasCreateCredentialsInvite);

  const handleOnClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();

    const {id} = supervisor;

    let _modalType = (): ModalType | undefined => {
      switch (e.currentTarget.textContent) {
        case 'Reset Password':
          return ModalType.RESET_PASSWORD;
        case 'Create and Send Invite':
          return ModalType.CREATE_AND_SEND_INVITE;
        case 'Resend Invite':
          return ModalType.RESEND_INVITE;
        default:
          return undefined;
      }
    };

    const modalType = _modalType();

    modalType &&
      window.dispatchEvent(
        new CustomEvent('modalEvent', {
          detail: {
            type: _modalType(),
            action: ModalAction.OPEN,
            payload: {supervisorId: id}
          }
        })
      );
  };

  return (
    <div className={styles.optionsContainer}>
      {hasCredentials && (
        <button
          type="button"
          onClick={handleOnClick}
          className={styles.button + ' ' + styles.resetPassword}>
          Reset Password
        </button>
      )}
      {needsInvite && (
        <button
          type="button"
          onClick={handleOnClick}
          className={styles.button + ' ' + styles.sendInvite}>
          Create and Send Invite
        </button>
      )}
      {hasCreateCredentialsInvite && (
        <button
          type="button"
          onClick={handleOnClick}
          className={styles.button + ' ' + styles.sendInvite}>
          Resend Invite
        </button>
      )}
    </div>
  );
}
