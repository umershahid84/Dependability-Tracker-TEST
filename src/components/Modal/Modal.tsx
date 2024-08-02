import React from 'react';

const styles = {
  innerDiv: 'bg-tertiary p-8 rounded-md shadow-lg relative w-full max-w-md',
  div: 'fixed inset-0 z-40 overflow-auto bg-black bg-opacity-50 flex justify-center items-center',
  button:
    'absolute top-4 right-4 text-primary print:text-black cursor-pointer hover:text-red-500 text-2xl'
};

export type ModalProps = {
  children: React.ReactNode;
  modalClassName?: string;
  setShowModal: (show: boolean) => void;
};
export function Modal({ children, modalClassName, setShowModal }: Readonly<ModalProps>) {
  const handleOnClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setShowModal(false);
  };

  return (
    <div className={styles.div}>
      <div className={modalClassName ?? styles.innerDiv}>
        <button type="button" onClick={handleOnClick} className={styles.button}>
          &times;
        </button>
        {children}
      </div>
    </div>
  );
}
