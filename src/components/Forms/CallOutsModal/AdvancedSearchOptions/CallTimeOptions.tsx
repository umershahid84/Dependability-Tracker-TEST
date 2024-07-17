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

type CallOutTimeRange = {
  end?: string;
  start?: string;
};

export type CallOutTimeOptionsProps = {
  dbSearchParamsFormState: UseDbSearchParamsFormState;
};

export function CallTimeOptions({dbSearchParamsFormState}: Readonly<CallOutTimeOptionsProps>) {
  const isMounted: boolean = useIsMounted();
  const [calloutTimeRange, setCalloutTimeRange] = useState<CallOutTimeRange>({});
  const [callTimeOptions, setCallTimeOptions] = useState<'time' | 'range' | null>(null);

  const callOutTimeRangeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {name, value} = e.target;

    setCalloutTimeRange(prevState => {
      return {
        ...prevState,
        [name]: value
      };
    });
  };

  const handleOptionsChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const {value} = e.target;
    setCallTimeOptions(value as 'time' | 'range' | null);
  };

  useEffect(() => {
    isMounted && setCallTimeOptions(null);
  }, [isMounted]);

  useEffect(() => {
    if (calloutTimeRange.start && calloutTimeRange.end) {
      dbSearchParamsFormState.handleSearchParamsChange({
        target: {
          name: 'callout_time_range',
          value: [calloutTimeRange.start, calloutTimeRange.end]
        }
      } as unknown as React.ChangeEvent<HTMLInputElement>);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [calloutTimeRange]);

  return (
    <FormLabelContainer addClasses="relative ">
      <label htmlFor="Call Time Options" className="font-medium mb-2 underline underline-offset-4">
        {callTimeOptions ? 'Call Time Options' : 'Select Call Time Options'}
      </label>
      {!callTimeOptions ? (
        <select
          name="Call Time Options"
          title="Call Time Options"
          className={styles.input}
          onChange={handleOptionsChange}>
          <option value="">Select Call Time Options</option>
          <option value="time">By Call Time</option>
          <option value="range">By Call Time Range</option>
        </select>
      ) : (
        <div className="w-full flex flex-col justify-start">
          <button
            type="button"
            onClick={() => setCallTimeOptions(null)}
            className="border border-gray-300 p-1  w-16  rounded-md hover:border-red-600 hover:text-red-600 absolute top-2 right-1">
            Clear
          </button>

          {callTimeOptions && callTimeOptions === 'time' ? (
            <div className="w-[90%] flex flex-col ml-8">
              <FormLabel
                label="Call Time"
                htmlFor="callout_time"
                className="block font-medium text-gray-300 mt-2"
              />
              <input
                type="time"
                name="callout_time"
                title="Call Time"
                value={dbSearchParamsFormState.searchParams.callout_time ?? ''}
                onChange={dbSearchParamsFormState.handleSearchParamsChange}
                className={styles.input}
              />
            </div>
          ) : (
            <></>
          )}

          {callTimeOptions && callTimeOptions === 'range' ? (
            <div className="w-[90%] flex flex-col ml-8">
              <FormLabel label="Call Time Range" htmlFor="" />
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
                title="Call Time Range Start Time"
                value={calloutTimeRange.start ?? ''}
                onChange={callOutTimeRangeChange}
                className={styles.input}
              />
              <span className="w-full flex flex-row justify-end">
                <FormLabel label="End" htmlFor="end" className=" font-medium text-gray-300 mr-2" />
              </span>
              <input
                type="time"
                name="end"
                title="Call Time Range End Time"
                value={calloutTimeRange.end ?? ''}
                onChange={callOutTimeRangeChange}
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
