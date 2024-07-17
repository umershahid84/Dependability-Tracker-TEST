import {
  useTimeRange,
  UseTimeRange,
  useTimeRangeOptions,
  UseTimeRangeOptions
} from '../../../../hooks';
import {useEffect} from 'react';
import {FormLabel} from '../../FormLabel';
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

export enum TimeRangeOptionsVariants {
  CALL_TIME = 'call_time_range',
  SHIFT_TIME = 'shift_time_range'
}

export type TimeRangeOptionsProps = {
  variant: TimeRangeOptionsVariants;
  dbSearchParamsFormState: UseDbSearchParamsFormState;
};

const timeRangeOptionsVariantMap = {
  type: {
    call_time_range: 'Call Time',
    shift_time_range: 'Shift Time'
  },

  dbSearchParamsName: {
    call_time_range: 'call_time_range',
    shift_time_range: 'shift_time_range'
  },
  label: {
    call_time_range: 'Call Time Options',
    shift_time_range: 'Shift Time Options'
  },
  value: {
    call_time_range: 'Select Call Time Options',
    shift_time_range: 'Select Shift Time Options'
  },
  time: {
    call_time_range: 'By Call Time',
    shift_time_range: 'By Shift Time'
  },
  range: {
    call_time_range: 'By Call Time Range',
    shift_time_range: 'By Shift Time Range'
  },
  timeRangeOptionLabel: {
    call_time_range: {
      true: 'Call Time Options',
      false: 'Select Call Time Options'
    },
    shift_time_range: {
      true: 'Shift Time Options',
      false: 'Select Shift Time Options'
    }
  },
  dbSearchParam_NonRange: {
    call_time_range: 'call_time',
    shift_time_range: 'shift_time'
  }
};

export function TimeRangeOptions({
  variant,
  dbSearchParamsFormState
}: Readonly<TimeRangeOptionsProps>) {
  const {timeRange, handleTimeRangeChange}: UseTimeRange = useTimeRange();
  const {timeRangeOption, setTimeRangeOption, handleTimeOptionsChange}: UseTimeRangeOptions =
    useTimeRangeOptions();

  const {
    type,
    dbSearchParamsName,
    label,
    value,
    time,
    range,
    timeRangeOptionLabel,
    dbSearchParam_NonRange
  } = timeRangeOptionsVariantMap;

  useEffect(() => {
    if (timeRange.start && timeRange.end) {
      dbSearchParamsFormState.handleSearchParamsChange({
        target: {
          name: dbSearchParamsName[variant],
          value: [timeRange.start, timeRange.end]
        }
      } as unknown as React.ChangeEvent<HTMLInputElement>);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeRange]);

  return (
    <FormLabelContainer addClasses="relative ">
      <label htmlFor={label[variant]} className="font-medium mb-2 underline underline-offset-4">
        {timeRangeOption
          ? timeRangeOptionLabel[variant]['true']
          : timeRangeOptionLabel[variant]['false']}
      </label>
      {!timeRangeOption ? (
        <select
          name={label[variant]}
          title={label[variant]}
          className={styles.input}
          onChange={handleTimeOptionsChange}>
          <option value="">{value[variant]}</option>
          <option value="time">{time[variant]}</option>
          <option value="range">{range[variant]}</option>
        </select>
      ) : (
        <div className="w-full flex flex-col justify-start">
          <button
            type="button"
            onClick={() => setTimeRangeOption(null)}
            className="border border-gray-300 p-1  w-16  rounded-md hover:border-red-600 hover:text-red-600 absolute top-2 right-1">
            Clear
          </button>

          {timeRangeOption && timeRangeOption === 'time' ? (
            <div className="w-[90%] flex flex-col ml-8">
              <FormLabel
                label={label[variant]}
                htmlFor={dbSearchParam_NonRange[variant]}
                className="block font-medium text-gray-300 mt-2"
              />
              <input
                type="time"
                title={label[variant]}
                className={styles.input}
                name={dbSearchParam_NonRange[variant]}
                value={
                  (dbSearchParamsFormState.searchParams[
                    dbSearchParam_NonRange[
                      variant
                    ] as keyof UseDbSearchParamsFormState['searchParams']
                  ] as number) ?? ''
                }
                onChange={dbSearchParamsFormState.handleSearchParamsChange}
              />
            </div>
          ) : (
            <></>
          )}

          {timeRangeOption && timeRangeOption === 'range' ? (
            <div className="w-[90%] flex flex-col ml-8">
              <FormLabel label={`${type[variant]} Range`} htmlFor="" />
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
                className={styles.input}
                value={timeRange.start ?? ''}
                onChange={handleTimeRangeChange}
                title={`${type[variant]} Range Start Time`}
              />
              <span className="w-full flex flex-row justify-end">
                <FormLabel label="End" htmlFor="end" className=" font-medium text-gray-300 mr-2" />
              </span>
              <input
                name="end"
                type="time"
                className={styles.input}
                value={timeRange.end ?? ''}
                onChange={handleTimeRangeChange}
                title={`${type[variant]} Range End Time`}
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
