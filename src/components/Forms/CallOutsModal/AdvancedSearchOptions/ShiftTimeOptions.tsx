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

type ShiftTimeRange = {
  end?: string;
  start?: string;
};

export type ShiftTimeOptionsProps = {
  dbSearchParamsFormState: UseDbSearchParamsFormState;
};

export function ShiftTimeOptions({dbSearchParamsFormState}: Readonly<ShiftTimeOptionsProps>) {
  const isMounted: boolean = useIsMounted();
  const [shiftTimeRange, setShiftTimeRange] = useState<ShiftTimeRange>({});
  const [shiftTimeOptions, setShiftTimeOptions] = useState<'time' | 'range' | null>(null);

  const shiftTimeRangeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {name, value} = e.target;

    setShiftTimeRange(prevState => {
      return {
        ...prevState,
        [name]: value
      };
    });
  };

  const handleOptionsChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const {value} = e.target;
    setShiftTimeOptions(value as 'time' | 'range' | null);
  };

  useEffect(() => {
    isMounted && setShiftTimeOptions(null);
  }, [isMounted]);

  useEffect(() => {
    if (shiftTimeRange.start && shiftTimeRange.end) {
      dbSearchParamsFormState.handleSearchParamsChange({
        target: {
          name: 'shift_time_range',
          value: [shiftTimeRange.start, shiftTimeRange.end]
        }
      } as unknown as React.ChangeEvent<HTMLInputElement>);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shiftTimeRange]);

  return (
    <FormLabelContainer addClasses="relative ">
      <label htmlFor="Shift Time Options" className="font-medium mb-2 underline underline-offset-4">
        {shiftTimeOptions ? 'Shift Time Options' : 'Select Shift Time Options'}
      </label>
      {!shiftTimeOptions ? (
        <select
          name="Shift Time Options"
          title="Shift Time Options"
          className={styles.input}
          onChange={handleOptionsChange}>
          <option value="">Select Shift Time Options</option>
          <option value="time">By Shift Time</option>
          <option value="range">By Shift Time Range</option>
        </select>
      ) : (
        <div className="w-full flex flex-col justify-start">
          <button
            type="button"
            onClick={() => setShiftTimeOptions(null)}
            className="border border-gray-300 p-1  w-16  rounded-md hover:border-red-600 hover:text-red-600 absolute top-2 right-1">
            Clear
          </button>

          {shiftTimeOptions && shiftTimeOptions === 'time' ? (
            <div className="w-[90%] flex flex-col ml-8">
              <FormLabel
                label="Shift Time"
                htmlFor="shift_time"
                className="block font-medium text-gray-300 mt-2"
              />
              <input
                type="time"
                name="shift_time"
                title="Shift Time"
                value={dbSearchParamsFormState.searchParams.shift_time ?? ''}
                onChange={dbSearchParamsFormState.handleSearchParamsChange}
                className={styles.input}
              />
            </div>
          ) : (
            <></>
          )}

          {shiftTimeOptions && shiftTimeOptions === 'range' ? (
            <div className="w-[90%] flex flex-col ml-8">
              <FormLabel label="Shift Time Range" htmlFor="" />
              <span className="w-full flex flex-row justify-end">
                <FormLabel
                  label="Start"
                  htmlFor="start"
                  className=" font-medium text-gray-300 mr-2"
                />
              </span>

              <input
                type="time"
                name="start"
                title="Shift Time Range Start Time"
                value={shiftTimeRange.start ?? ''}
                onChange={shiftTimeRangeChange}
                className={styles.input}
              />
              <span className="w-full flex flex-row justify-end">
                <FormLabel label="End" htmlFor="end" className=" font-medium text-gray-300 mr-2" />
              </span>
              <input
                type="time"
                name="end"
                title="Shift Time Range End Time"
                value={shiftTimeRange.end ?? ''}
                onChange={shiftTimeRangeChange}
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
