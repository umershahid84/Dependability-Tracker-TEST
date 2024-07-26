import React, {useState} from 'react';
import {useIsMounted} from '../../../hooks';
import {ClientAPI} from '../../../client-api';
import {trim} from '../../../lib/utils/shared/strings';
import FormInputWithErrors from '../FormInputs/FormInputWithErrors';
import {EmployeeWithAssociations} from '../../../lib/db/controller';

export type DeleteEmployeeFormProps = {
  employeeData?: EmployeeWithAssociations;
  onModalDeleteCallBack: (employeeId: string) => void;
};

const styles = {
  div: 'w-full flex flex-col justify-center items-center mt-4',
  defaultButton: trim(`min-w-36 max-w-42 h-auto p-4 bg-slate-700 text-lg rounded-md 
                  hover:bg-[var(--error)] hover:text-white Text-outline`),
  disabled: 'min-w-36 max-w-42 p-4 bg-slate-700 text-lg rounded-md cursor-not-allowed'
};

export function DeleteEmployeeForm({
  employeeData,
  onModalDeleteCallBack
}: Readonly<DeleteEmployeeFormProps>) {
  const isMounted: boolean = useIsMounted();
  const [inputValue, setInputValue] = useState('');
  const [errors, setErrors] = useState<string[]>([]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleFormSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (inputValue !== employeeData?.name) {
      setErrors(['Employee name does not match']);
      return;
    } else {
      setErrors([]);
    }

    const didDelete: boolean = await ClientAPI.Employees.Delete({id: employeeData?.id});

    setInputValue('');
    if (didDelete) {
      onModalDeleteCallBack(employeeData?.id);
      // window.dispatchEvent(new CustomEvent('employeeUpdated'));
    }
  };

  return isMounted ? (
    <form
      onSubmit={e => {
        e.preventDefault();
      }}>
      <h2 className="text-lg text-center text-red-600 font-bold">Delete Employee</h2>
      <FormInputWithErrors
        type="text"
        errors={errors}
        value={inputValue}
        id="deleteEmployee"
        onChange={handleInputChange}
        label="Confirm Employee Deletion"
        placeholder={`Type '${employeeData?.name}' to delete`}
        gap={`mt-2 ${inputValue === employeeData?.name ? '' : 'focus:ring-[var(--error)]'}`}
      />
      <div className={styles.div}>
        <button
          type="button"
          // @ts-ignore
          onClick={handleFormSubmit}
          disabled={inputValue !== employeeData?.name}
          className={styles.defaultButton}>
          Delete Employee
        </button>
      </div>
    </form>
  ) : (
    <></>
  );
}
