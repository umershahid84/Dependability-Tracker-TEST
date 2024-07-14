import React from 'react';

const styles = {
  innerDiv: 'bg-gray-800 p-8 rounded-md shadow-lg relative w-full max-w-md',
  div: 'fixed inset-0 z-40 overflow-auto bg-black bg-opacity-50 flex justify-center items-center',
  button:
    'absolute top-4 right-4 text-gray-300 print:text-black cursor-pointer hover:text-red-500 text-2xl'
};

export type ModalProps = {
  children: React.ReactNode;
  setShowModal: (show: boolean) => void;
};
export function Modal({children, setShowModal}: Readonly<ModalProps>) {
  return (
    <div className={styles.div}>
      <div className={styles.innerDiv}>
        <button type="button" onClick={() => setShowModal(false)} className={styles.button}>
          &times;
        </button>
        {children}
      </div>
    </div>
  );
}
