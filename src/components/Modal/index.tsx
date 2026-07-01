export enum ModalType {
  ADD_EMPLOYEE = 'Add Employee',
  EDIT_CALL_OUT = 'Edit Call Out',
  EDIT_EMPLOYEE = 'Edit Employee',
  RESEND_INVITE = 'Resend Invite',
  RESET_PASSWORD = 'Reset Password',
  CREATE_TEMP_PASSWORD = 'Create Temporary Password',
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
    case ModalType.CREATE_TEMP_PASSWORD:
      return (
        <CreateTemporaryPassword
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
