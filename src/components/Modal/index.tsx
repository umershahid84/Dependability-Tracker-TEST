import {
  AddEmployeeForm,
  EditCallOutModal,
  EditEmployeeForm,
  CallOutsAdvancedSearch
} from '../Forms';
import {
  ResetSupervisorPassword,
  RevokeCredentialsInvite,
  ResendCreateCredentialInviteByEmail,
  CreateCredentialInviteAndEmailItToSupervisor
} from '../Forms/Supervisors';
import {Modal} from './Modal';
import React, {useEffect} from 'react';
import {useIsMounted} from '../../hooks';
import {EmployeeWithAssociations} from '../../lib/db/controller';
import {DeleteCallOutForm} from '../Forms/CallOut/DeleteCallOutModal';
import type {CallOutWithAssociations} from '../../lib/db/models/types';
import {RevokeCredentials} from '../Forms/Supervisors/RevokeCredentials';
import {DeleteEmployeeForm} from '../Forms/EmployeeModal/DeleteEmployeeForm';

export enum ModalType {
  ADD_EMPLOYEE = 'Add Employee',
  EDIT_CALL_OUT = 'Edit Call Out',
  EDIT_EMPLOYEE = 'Edit Employee',
  RESEND_INVITE = 'Resend Invite',
  RESET_PASSWORD = 'Reset Password',
  DELETE_CALL_OUT = 'Delete Call Out',
  DELETE_EMPLOYEE = 'Delete Employee',
  REVOKE_CREDENTIALS = 'Revoke Credentials',
  CREATE_AND_SEND_INVITE = 'Create and Send Invite',
  ADVANCED_CALLOUT_SEARCH = 'Advanced CallOut Search',
  REVOKE_CREDENTIALS_INVITE = 'Revoke Credentials Invite'
}

export type ModalProps = {
  type: ModalType;
};

export enum ModalAction {
  OPEN = 'Open',
  CLOSE = 'Close'
}

export type ModalActionProps = {
  payload?: any;
  type: ModalType;
  action: ModalAction;
};

function RenderModalBody({
  type,
  data
}: Readonly<{
  type: ModalType;
  data: any;
}>) {
  switch (type) {
    case ModalType.ADD_EMPLOYEE:
      return <AddEmployeeForm onModalEditCallBack={data?.onModalEditCallBack} />;
    case ModalType.EDIT_EMPLOYEE:
      return (
        <EditEmployeeForm
          employeeData={data?.employee as EmployeeWithAssociations}
          onModalEditCallBack={data?.onModalEditCallBack}
        />
      );
    case ModalType.DELETE_EMPLOYEE:
      return (
        <DeleteEmployeeForm
          employeeData={data?.employee as EmployeeWithAssociations}
          onModalDeleteCallBack={data?.onModalDeleteCallBack}
        />
      );
    case ModalType.ADVANCED_CALLOUT_SEARCH:
      return <CallOutsAdvancedSearch />;
    case ModalType.EDIT_CALL_OUT:
      return (
        <EditCallOutModal
          callOutData={data?.callOut as CallOutWithAssociations}
          onModalEditCallBack={
            data?.onModalEditCallBack as (callOut: CallOutWithAssociations) => void
          }
        />
      );
    case ModalType.DELETE_CALL_OUT:
      return (
        <DeleteCallOutForm
          onModalDeleteCallBack={data?.onModalDeleteCallBack as (callOutId: string) => void}
          callOutData={data?.callOut as CallOutWithAssociations}
        />
      );
    case ModalType.RESET_PASSWORD:
      return (
        <ResetSupervisorPassword
          supervisor={data?.supervisor}
          onModalEditCallBack={data?.onModalEditCallBack}
        />
      );
    case ModalType.CREATE_AND_SEND_INVITE:
      return (
        <CreateCredentialInviteAndEmailItToSupervisor
          supervisor={data?.supervisor}
          onModalEditCallBack={data?.onModalEditCallBack}
        />
      );
    case ModalType.RESEND_INVITE:
      return (
        <ResendCreateCredentialInviteByEmail
          supervisor={data?.supervisor}
          onModalEditCallBack={data?.onModalEditCallBack}
        />
      );
    case ModalType.REVOKE_CREDENTIALS:
      return (
        <RevokeCredentials
          supervisor={data?.supervisor}
          onModalEditCallBack={data?.onModalEditCallBack}
        />
      );
    case ModalType.REVOKE_CREDENTIALS_INVITE:
      return (
        <RevokeCredentialsInvite
          supervisor={data?.supervisor}
          onModalEditCallBack={data?.onModalEditCallBack}
        />
      );
    default:
      return <></>;
  }
}

export function ModalViewer(): React.ReactElement {
  const isMounted: boolean = useIsMounted();
  const [data, setData] = React.useState<any>(null);
  const [type, setType] = React.useState<ModalType | null>(null);
  const [showModal, setShowModal] = React.useState<boolean>(false);
  const [modalClasses, setModalClasses] = React.useState<string | null>(null);

  const handleModalEvent = (event: Event) => {
    const {detail} = event as CustomEvent<ModalActionProps>;

    setType(detail.type);
    setData(detail?.payload ?? null);
    setShowModal(detail?.action === ModalAction.OPEN);
    setModalClasses(detail?.payload?.modalClasses ?? null);
  };

  useEffect(() => {
    if (isMounted) {
      window.addEventListener('modalEvent', handleModalEvent);
    }

    return () => {
      window.removeEventListener('modalEvent', handleModalEvent);
    };
  }, [isMounted]);

  return showModal && type ? (
    <Modal setShowModal={setShowModal} modalClassName={modalClasses ?? undefined}>
      <RenderModalBody type={type} data={data} />
    </Modal>
  ) : (
    <></>
  );
}
