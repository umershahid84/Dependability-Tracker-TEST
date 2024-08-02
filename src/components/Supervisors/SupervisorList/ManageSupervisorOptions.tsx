import { ModalAction, ModalType } from '../../Modal';
import type { SupervisorWithAssociations } from '../../../lib/db/models/types';

const styles = {
  resetPassword: 'hover:bg-red-500',
  sendInvite: 'hover:bg-indigo-500',
  optionsContainer: 'mt-3 flex flex-wrap flex-row gap-6',
  button: 'px-2 py-1 bg-quaternary text-primary rounded mr-2'
};

export function ManageSupervisorOptions({
  supervisor,
  onModalEditCallBack,
  onModalDeleteCallBack
}: Readonly<{
  supervisor: SupervisorWithAssociations;
  onModalDeleteCallBack: (supervisorId: string) => void;
  onModalEditCallBack: (supervisor: SupervisorWithAssociations, isNew?: boolean) => void;
}>): React.ReactElement {
  const hasCredentials: boolean = Boolean(supervisor.login_credentials);
  const hasCreateCredentialsInvite: boolean = Boolean(supervisor.create_credentials_invite);
  const needsInvite: boolean = Boolean(!hasCredentials && !hasCreateCredentialsInvite);

  const handleOnClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();

    let _modalType = (): ModalType | undefined => {
      switch (e.currentTarget.textContent) {
        case 'Reset Password':
          return ModalType.RESET_PASSWORD;
        case 'Create and Send Invite':
          return ModalType.CREATE_AND_SEND_INVITE;
        case 'Resend Invite':
          return ModalType.RESEND_INVITE;
        case 'Revoke Credentials':
          return ModalType.REVOKE_CREDENTIALS;
        case 'Revoke Credentials Invite':
          return ModalType.REVOKE_CREDENTIALS_INVITE;
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
            payload: { supervisor, onModalEditCallBack, onModalDeleteCallBack }
          }
        })
      );
  };

  return (
    <div className={styles.optionsContainer}>
      {hasCredentials && (
        <>
          {' '}
          <button
            type="button"
            onClick={handleOnClick}
            className={styles.button + ' ' + styles.resetPassword}>
            Reset Password
          </button>
          <button
            type="button"
            onClick={handleOnClick}
            className={styles.button + ' ' + styles.resetPassword}>
            Revoke Credentials
          </button>
        </>
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
        <>
          <button
            type="button"
            onClick={handleOnClick}
            className={styles.button + ' ' + styles.sendInvite}>
            Resend Invite
          </button>
          <button
            type="button"
            onClick={handleOnClick}
            className={styles.button + ' ' + styles.resetPassword}>
            Revoke Credentials Invite
          </button>
        </>
      )}
    </div>
  );
}
