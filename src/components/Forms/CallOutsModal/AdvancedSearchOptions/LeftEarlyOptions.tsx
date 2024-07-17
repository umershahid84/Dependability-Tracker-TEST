import {useEffect, useState} from 'react';
import {FormLabel} from '../../FormLabel';
import {useIsMounted} from '../../../../hooks';
import {FormLabelContainer} from '../../EmployeeModal/FormLayout';

import {UseDbSearchParamsFormState} from '../../../CallOuts/CallOutsList/helpers';

const styles = {
  form: 'grid grid-cols-1 gap-4 w-full',
  buttonContainer: 'w-full flex justify-end',
  h2: 'text-2xl font-bold mb-4 text-center mt-2',
  input: 'border p-2 rounded-md w-full bg-slate-800 text-gray-300',
  inputWithMargin: 'mr-2 h-4 w-4  border-gray-300 rounded bg-slate-800',
  button: 'bg-blue-500 text-white rounded-md py-2 px-4 hover:bg-blue-600'
};

type LeftEarlyRange = {
  end?: number;
  start?: number;
};

export type LeftEarlyDateOptionsProps = {
  dbSearchParamsFormState: UseDbSearchParamsFormState;
};

export function LeftEarlyOptions({dbSearchParamsFormState}: Readonly<LeftEarlyDateOptionsProps>) {
  const isMounted: boolean = useIsMounted();
  const [leftEarlyRange, setLeftEarlyRange] = useState<LeftEarlyRange>({});
  const [leftEarlyOptions, setLeftEarlyOptions] = useState<'mins' | 'range' | null>(null);

  const leftEarlyRangeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {name, value} = e.target;

    setLeftEarlyRange(prevState => {
      return {
        ...prevState,
        [name]: Number(value)
      };
    });
  };

  const handleOptionsChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const {value} = e.target;
    setLeftEarlyOptions(value as 'mins' | 'range' | null);
  };

  useEffect(() => {
    isMounted && setLeftEarlyOptions(null);
  }, [isMounted]);

  useEffect(() => {
    if (leftEarlyRange.start && leftEarlyRange.end) {
      dbSearchParamsFormState.handleSearchParamsChange({
        target: {
          name: 'left_early_mins_range',
          value: [leftEarlyRange.start, leftEarlyRange.end]
        }
      } as unknown as React.ChangeEvent<HTMLInputElement>);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [leftEarlyRange]);

  return (
    <FormLabelContainer addClasses="relative ">
      <label htmlFor="Left Early Options" className="font-medium mb-2 underline underline-offset-4">
        {leftEarlyOptions ? 'Left Early Options' : 'Select Left Early Options'}
      </label>
      {!leftEarlyOptions ? (
        <select
          name="Left Early Options"
          title="Left Early Options"
          className={styles.input}
          onChange={handleOptionsChange}>
          <option value="">Select Left Early Options</option>
          <option value="mins">By Left Early</option>
          <option value="range">By Left Early Range</option>
        </select>
      ) : (
        <div className="w-full flex flex-col justify-start">
          <button
            type="button"
            onClick={() => setLeftEarlyOptions(null)}
            className="border border-gray-300 p-1  w-16  rounded-md hover:border-red-600 hover:text-red-600 absolute top-2 right-1">
            Clear
          </button>

          {leftEarlyOptions && leftEarlyOptions === 'mins' ? (
            <div className="w-[90%] flex flex-col ml-8">
              <FormLabel
                label="Left Early"
                htmlFor="left_early_mins"
                className="block font-medium text-gray-300 mt-2"
              />
              <input
                type="number"
                name="left_early_mins"
                title="Left Early"
                min="0"
                max="600"
                value={dbSearchParamsFormState.searchParams.left_early_mins ?? ''}
                onChange={dbSearchParamsFormState.handleSearchParamsChange}
                className={styles.input}
              />
            </div>
          ) : (
            <></>
          )}

          {leftEarlyOptions && leftEarlyOptions === 'range' ? (
            <div className="w-[90%] flex flex-col ml-8">
              <FormLabel label="Left Early Range" htmlFor="" />
              <span className="w-full flex flex-row justify-end">
                <FormLabel
                  label="Start"
                  htmlFor="start"
                  className=" font-medium text-gray-300 mr-2"
                />
              </span>

              <input
                type="number"
                name="start"
                min="0"
                max="600"
                title="Left Early Range Start Date"
                value={leftEarlyRange.start ?? ''}
                onChange={leftEarlyRangeChange}
                className={styles.input}
              />
              <span className="w-full flex flex-row justify-end">
                <FormLabel label="End" htmlFor="end" className=" font-medium text-gray-300 mr-2" />
              </span>
              <input
                type="number"
                name="end"
                min="0"
                max="600"
                title="Left Early Range End Date"
                value={leftEarlyRange.end ?? ''}
                onChange={leftEarlyRangeChange}
                className={styles.input}
              />
            </div>
          ) : (
            <></>
          )}
        </div>
      )}
    </FormLabelContainer>
  );
}
