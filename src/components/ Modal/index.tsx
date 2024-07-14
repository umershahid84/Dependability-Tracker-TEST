import {Modal} from './Modal';
import React, {useEffect} from 'react';
import {AddEmployeeForm} from '../Forms';
import {useIsMounted} from '../../hooks';

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
  type
}: Readonly<{
  type: ModalType;
}>) {
  switch (type) {
    case ModalType.ADD_EMPLOYEE:
      return <AddEmployeeForm />;
    case ModalType.EDIT_EMPLOYEE:
      return <></>;
    case ModalType.DELETE_EMPLOYEE:
      return <></>;
    default:
      return <></>;
  }
}

export function ModalViewer(): React.ReactElement {
  const isMounted: boolean = useIsMounted();
  const [type, setType] = React.useState<ModalType | null>(null);
  const [showModal, setShowModal] = React.useState<boolean>(false);

  const handleModalEvent = (event: Event) => {
    const {detail} = event as CustomEvent<ModalActionProps>;

    if (detail?.type) setType(detail.type);
    if (detail?.action) setShowModal(detail.action === ModalAction.OPEN);
  };

  useEffect(() => {
    if (isMounted) {
      window.addEventListener('modalEvent', handleModalEvent);

      return () => {
        if (isMounted) {
          window.removeEventListener('modalEvent', handleModalEvent);
        }
      };
    }
  }, [isMounted]);

  return showModal && type ? (
    <Modal setShowModal={setShowModal}>
      <RenderModalBody type={type} />
    </Modal>
  ) : (
    <></>
  );
}
