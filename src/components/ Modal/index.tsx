import {Modal} from './Modal';
import React, {useEffect} from 'react';
import {useIsMounted} from '../../hooks';
import {EmployeeWithAssociations} from '../../lib/db/controller';
import {LeaveTypeAttributes} from '../../lib/db/models/LeaveType';
import {UseDbSearchParamsFormState} from '../CallOuts/CallOutsList/helpers';
import {DeleteEmployeeForm} from '../Forms/EmployeeModal/DeleteEmployeeForm';
import {AddEmployeeForm, CallOutsAdvancedSearch, EditEmployeeForm} from '../Forms';

export enum ModalType {
  ADD_EMPLOYEE = 'Add Employee',
  EDIT_EMPLOYEE = 'Edit Employee',
  DELETE_EMPLOYEE = 'Delete Employee',
  ADVANCED_CALLOUT_SEARCH = 'Advanced CallOut Search'
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
  data?: {dbSearchParams?: UseDbSearchParamsFormState} & {
    employees?: EmployeeWithAssociations[];
  } & {
    leaveTypes?: LeaveTypeAttributes[];
  };
}>) {
  switch (type) {
    case ModalType.ADD_EMPLOYEE:
      return <AddEmployeeForm />;
    case ModalType.EDIT_EMPLOYEE:
      return <EditEmployeeForm employeeData={data as EmployeeWithAssociations} />;
    case ModalType.DELETE_EMPLOYEE:
      return <DeleteEmployeeForm employeeData={data as EmployeeWithAssociations} />;
    case ModalType.ADVANCED_CALLOUT_SEARCH:
      return (
        <CallOutsAdvancedSearch
          leaveTypes={data?.leaveTypes as LeaveTypeAttributes[]}
          employees={data?.employees as EmployeeWithAssociations[]}
          dbSearchParamsFormState={data?.dbSearchParams as UseDbSearchParamsFormState}
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
