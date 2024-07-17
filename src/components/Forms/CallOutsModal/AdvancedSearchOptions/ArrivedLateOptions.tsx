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

type ArrivedLateRange = {
  end?: number;
  start?: number;
};

export type ArrivedLateDateOptionsProps = {
  dbSearchParamsFormState: UseDbSearchParamsFormState;
};

export function ArrivedLateOptions({
  dbSearchParamsFormState
}: Readonly<ArrivedLateDateOptionsProps>) {
  const isMounted: boolean = useIsMounted();
  const [arrivedLateRange, setArrivedLateRange] = useState<ArrivedLateRange>({});
  const [arrivedLateOptions, setArrivedLateOptions] = useState<'mins' | 'range' | null>(null);

  const arrivedLateRangeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {name, value} = e.target;

    setArrivedLateRange(prevState => {
      return {
        ...prevState,
        [name]: Number(value)
      };
    });
  };

  const handleOptionsChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const {value} = e.target;
    setArrivedLateOptions(value as 'mins' | 'range' | null);
  };

  useEffect(() => {
    isMounted && setArrivedLateOptions(null);
  }, [isMounted]);

  useEffect(() => {
    if (arrivedLateRange.start && arrivedLateRange.end) {
      dbSearchParamsFormState.handleSearchParamsChange({
        target: {
          name: 'arrived_late_mins_range',
          value: [arrivedLateRange.start, arrivedLateRange.end]
        }
      } as unknown as React.ChangeEvent<HTMLInputElement>);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [arrivedLateRange]);

  return (
    <FormLabelContainer addClasses="relative ">
      <label
        htmlFor="Arrived Late Options"
        className="font-medium mb-2 underline underline-offset-4">
        {arrivedLateOptions ? 'Arrived Late Options' : 'Select Arrived Late Options'}
      </label>
      {!arrivedLateOptions ? (
        <select
          name="Arrived Late Options"
          title="Arrived Late Options"
          className={styles.input}
          onChange={handleOptionsChange}>
          <option value="">Select Arrived Late Options</option>
          <option value="mins">By Arrived Late</option>
          <option value="range">By Arrived Late Range</option>
        </select>
      ) : (
        <div className="w-full flex flex-col justify-start">
          <button
            type="button"
            onClick={() => setArrivedLateOptions(null)}
            className="border border-gray-300 p-1  w-16  rounded-md hover:border-red-600 hover:text-red-600 absolute top-2 right-1">
            Clear
          </button>

          {arrivedLateOptions && arrivedLateOptions === 'mins' ? (
            <div className="w-[90%] flex flex-col ml-8">
              <FormLabel
                label="Arrived Late"
                htmlFor="arrived_late_mins"
                className="block font-medium text-gray-300 mt-2"
              />
              <input
                type="number"
                name="arrived_late_mins"
                title="Arrived Late"
                min="0"
                max="600"
                value={dbSearchParamsFormState.searchParams.arrived_late_mins ?? ''}
                onChange={dbSearchParamsFormState.handleSearchParamsChange}
                className={styles.input}
              />
            </div>
          ) : (
            <></>
          )}

          {arrivedLateOptions && arrivedLateOptions === 'range' ? (
            <div className="w-[90%] flex flex-col ml-8">
              <FormLabel label="Arrived Late Range" htmlFor="" />
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
                title="Arrived Late Range Start Date"
                value={arrivedLateRange.start ?? ''}
                onChange={arrivedLateRangeChange}
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
                title="Arrived Late Range End Date"
                value={arrivedLateRange.end ?? ''}
                onChange={arrivedLateRangeChange}
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
