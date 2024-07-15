import {Modal} from './Modal';
import React, {useEffect} from 'react';
import {useIsMounted} from '../../hooks';
import {AddEmployeeForm, EditEmployeeForm} from '../Forms';
import {EmployeeWithAssociations} from '../../lib/db/controller';
import {DeleteEmployeeForm} from '../Forms/EmployeeModal/DeleteEmployeeForm';

export enum ModalType {
  ADD_EMPLOYEE = 'Add Employee',
  EDIT_EMPLOYEE = 'Edit Employee',
  DELETE_EMPLOYEE = 'Delete Employee'
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
  data?: EmployeeWithAssociations;
}>) {
  switch (type) {
    case ModalType.ADD_EMPLOYEE:
      return <AddEmployeeForm />;
    case ModalType.EDIT_EMPLOYEE:
      return <EditEmployeeForm employeeData={data} />;
    case ModalType.DELETE_EMPLOYEE:
      return <DeleteEmployeeForm employeeData={data} />;
    default:
      return <></>;
  }
}

export function ModalViewer(): React.ReactElement {
  const isMounted: boolean = useIsMounted();
  const [data, setData] = React.useState<any>(null);
  const [type, setType] = React.useState<ModalType | null>(null);
  const [showModal, setShowModal] = React.useState<boolean>(false);

  const handleModalEvent = (event: Event) => {
    const {detail} = event as CustomEvent<ModalActionProps>;

    setType(detail.type);
    setData(detail?.payload ?? null);
    setShowModal(detail?.action === ModalAction.OPEN);
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
    <Modal setShowModal={setShowModal}>
      <RenderModalBody type={type} data={data} />
    </Modal>
  ) : (
    <></>
  );
}
