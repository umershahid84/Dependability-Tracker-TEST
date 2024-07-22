import React, {useState} from 'react';
import {useIsMounted} from '../../../../hooks';
import {ClientAPI} from '../../../../client-api';
import {ApiData} from '../../../../lib/apiController';
import {makeToast, ToastTypes} from '../../../Toasts';
import {trim} from '../../../../lib/utils/shared/strings';
import FormInputWithErrors from '../../FormInputs/FormInputWithErrors';
import {CallOutWithAssociations} from '../../../../lib/db/models/types';

export type DeleteCallOutFormProps = {
  callOutData?: CallOutWithAssociations;
  onModalDeleteCallBack: (callOutId: string) => void;
};

const styles = {
  div: 'w-full flex flex-col justify-center items-center mt-4',
  defaultButton: trim(`min-w-36 max-w-42 h-auto p-4 bg-slate-700 text-lg rounded-md 
                  hover:bg-[var(--error)] hover:text-white Text-outline`),
  disabled: 'min-w-36 max-w-42 p-4 bg-slate-700 text-lg rounded-md cursor-not-allowed'
};

export function DeleteCallOutForm({callOutData, onModalDeleteCallBack}: DeleteCallOutFormProps) {
  const isMounted: boolean = useIsMounted();
  const [inputValue, setInputValue] = useState('');
  const [errors, setErrors] = useState<string[]>([]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleFormSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (inputValue.toLocaleLowerCase() !== 'delete') {
      setErrors(['You must type "Delete" to delete this call out']);
      return;
    } else {
      setErrors([]);
    }

    try {
      const deletedId: ApiData<string> = await ClientAPI.CallOuts.Delete(callOutData?.id as string);

      if (deletedId?.error) throw new Error('CallOut could not be deleted');

      makeToast({
        type: ToastTypes.Success,
        title: 'Success',
        message: `CallOut for  ${callOutData?.employee.name} has been deleted`
      });

      onModalDeleteCallBack(callOutData?.id as string);

      setInputValue('');
    } catch (error) {
      console.error('Error Deleting Callout:\n', error);
      makeToast({
        type: ToastTypes.Error,
        title: 'Error',
        message: `CallOut ${callOutData?.id} could not be deleted`
      });
    }
  };

  return isMounted ? (
    <form
      onSubmit={e => {
        e.preventDefault();
      }}>
      <h2 className="text-lg text-center text-red-600 font-bold">Delete CallOut</h2>
      <FormInputWithErrors
        type="text"
        errors={errors}
        value={inputValue}
        id="deleteCallout"
        onChange={handleInputChange}
        label="Confirm Record Deletion"
        placeholder={`Type 'Delete' to delete`}
        className={`w-full p-2 rounded-md bg-slate-700 ring-1 ring-slate-700 focus:ring-2 focus:outline-none ${
          inputValue.toLowerCase() === 'delete'
            ? 'focus:ring-gray-300'
            : 'focus:ring-[var(--error)]'
        }`}
        gap={`mt-2 `}
      />
      <div className={styles.div}>
        <button
          tabIndex={-1}
          type="button"
          // @ts-ignore
          onClick={handleFormSubmit}
          className={styles.defaultButton}
          disabled={inputValue.toLowerCase() !== 'delete'}>
          Delete CallOut
        </button>
      </div>
    </form>
  ) : (
    <></>
  );
}
