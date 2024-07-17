import {
  useDateRange,
  UseDateRange,
  useTimeRange,
  UseTimeRange,
  useDateRangeOptions,
  UseDateRangeOptions,
  useTimeRangeOptions,
  UseTimeRangeOptions
} from '../../../../hooks';
import {useEffect} from 'react';
import {FormLabel} from '../../FormLabel';
import {dateTo_YYYY_MM_DD} from '../../../../lib/utils';
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

export enum RangeOptionsVariant {
  CALL_TIME = 'call_time_range',
  SHIFT_TIME = 'shift_time_range',
  SHIFT_DATE = 'shift_date_range',
  CALL_DATE = 'callout_date_range'
}

export type RangeOptionsProps = {
  variant: RangeOptionsVariant;
  dbSearchParamsFormState: UseDbSearchParamsFormState;
};

const timeRangeOptionsVariantMap = {
  type: {
    call_time_range: 'Call Time',
    shift_time_range: 'Shift Time',
    callout_date_range: 'Call Date',
    shift_date_range: 'Shift Date'
  },

  dbSearchParamsName: {
    call_time_range: 'call_time_range',
    shift_time_range: 'shift_time_range',
    callout_date_range: 'callout_date_range',
    shift_date_range: 'shift_date_range'
  },
  label: {
    call_time_range: 'Call Time Options',
    shift_time_range: 'Shift Time Options',
    callout_date_range: 'Call Date Options',
    shift_date_range: 'Shift Date Options'
  },
  value: {
    call_time_range: 'Select Call Time Options',
    shift_time_range: 'Select Shift Time Options',
    callout_date_range: 'Select Call Date Options',
    shift_date_range: 'Select Shift Date Options'
  },
  time: {
    call_time_range: 'By Call Time',
    shift_time_range: 'By Shift Time',
    callout_date_range: 'By Call Date',
    shift_date_range: 'By Shift Date'
  },
  range: {
    call_time_range: 'By Call Time Range',
    shift_time_range: 'By Shift Time Range',
    callout_date_range: 'By Call Date Range',
    shift_date_range: 'By Shift Date Range'
  },
  timeRangeOptionLabel: {
    call_time_range: {
      true: 'Call Time Options',
      false: 'Select Call Time Options'
    },
    shift_time_range: {
      true: 'Shift Time Options',
      false: 'Select Shift Time Options'
    },
    callout_date_range: {
      true: 'Call Date Options',
      false: 'Select Call Date Options'
    },
    shift_date_range: {
      true: 'Shift Date Options',
      false: 'Select Shift Date Options'
    }
  },
  dbSearchParam_NonRange: {
    call_time_range: 'call_time',
    shift_time_range: 'shift_time',
    callout_date_range: 'callout_date',
    shift_date_range: 'shift_date'
  },
  inputType: {
    call_time_range: 'time',
    shift_time_range: 'time',
    callout_date_range: 'date',
    shift_date_range: 'date'
  },
  optionValues: {
    call_time_range: ['time', 'range'],
    shift_time_range: ['time', 'range'],
    callout_date_range: ['date', 'range'],
    shift_date_range: ['date', 'range']
  },
  valueFormatter: {
    call_time_range: (value: string) => value,
    shift_time_range: (value: string) => value,
    callout_date_range: (value: Date) => dateTo_YYYY_MM_DD(value),
    shift_date_range: (value: Date) => dateTo_YYYY_MM_DD(value)
  }
};

export function RangeOptions({variant, dbSearchParamsFormState}: Readonly<RangeOptionsProps>) {
  const {timeRange, handleTimeRangeChange}: UseTimeRange = useTimeRange();
  const {dateRange, handleDateRangeChange}: UseDateRange = useDateRange();
  const {dateRangeOption, setDateRangeOption, handleDateOptionsChange}: UseDateRangeOptions =
    useDateRangeOptions();
  const {timeRangeOption, setTimeRangeOption, handleTimeOptionsChange}: UseTimeRangeOptions =
    useTimeRangeOptions();

  const stateOptionsVariantMap = {
    call_time_range: {
      rangeValue: timeRange,
      optionValue: timeRangeOption,
      setOptionValue: setTimeRangeOption,
      handleRangeChange: handleTimeRangeChange,
      handleOptionChange: handleTimeOptionsChange
    },
    shift_time_range: {
      rangeValue: timeRange,
      optionValue: timeRangeOption,
      setOptionValue: setTimeRangeOption,
      handleRangeChange: handleTimeRangeChange,
      handleOptionChange: handleTimeOptionsChange
    },
    callout_date_range: {
      rangeValue: dateRange,
      optionValue: dateRangeOption,
      setOptionValue: setDateRangeOption,
      handleRangeChange: handleDateRangeChange,
      handleOptionChange: handleDateOptionsChange
    },
    shift_date_range: {
      rangeValue: dateRange,
      optionValue: dateRangeOption,
      setOptionValue: setDateRangeOption,
      handleRangeChange: handleDateRangeChange,
      handleOptionChange: handleDateOptionsChange
    }
  };

  const {
    type,
    label,
    value,
    time,
    range,
    inputType,
    optionValues,
    valueFormatter,
    dbSearchParamsName,
    timeRangeOptionLabel,
    dbSearchParam_NonRange
  } = timeRangeOptionsVariantMap;

  useEffect(() => {
    if (
      stateOptionsVariantMap[variant].rangeValue.start &&
      stateOptionsVariantMap[variant].rangeValue.end
    ) {
      dbSearchParamsFormState.handleSearchParamsChange({
        target: {
          name: dbSearchParamsName[variant],
          value: [
            stateOptionsVariantMap[variant].rangeValue.start,
            stateOptionsVariantMap[variant].rangeValue.end
          ]
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
          onChange={stateOptionsVariantMap[variant].handleOptionChange}>
          <option value="">{value[variant]}</option>
          <option value={optionValues[variant][0]}>{time[variant]}</option>
          <option value={optionValues[variant][1]}>{range[variant]}</option>
        </select>
      ) : (
        <div className="w-full flex flex-col justify-start">
          <button
            type="button"
            onClick={() => stateOptionsVariantMap[variant].setOptionValue(null)}
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
                title={label[variant]}
                className={styles.input}
                type={inputType[variant]}
                name={dbSearchParam_NonRange[variant]}
                value={valueFormatter[variant](
                  (dbSearchParamsFormState.searchParams[
                    dbSearchParam_NonRange[
                      variant
                    ] as keyof UseDbSearchParamsFormState['searchParams']
                  ] as any) ?? ''
                )}
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
                name="start"
                className={styles.input}
                type={inputType[variant]}
                title={`${type[variant]} Range Start Time`}
                onChange={stateOptionsVariantMap[variant].handleRangeChange}
                value={
                  valueFormatter[variant](
                    stateOptionsVariantMap[variant].rangeValue.start as any
                  ) ?? ''
                }
              />
              <span className="w-full flex flex-row justify-end">
                <FormLabel label="End" htmlFor="end" className=" font-medium text-gray-300 mr-2" />
              </span>
              <input
                name="end"
                className={styles.input}
                type={inputType[variant]}
                value={
                  valueFormatter[variant](stateOptionsVariantMap[variant].rangeValue.end as any) ??
                  ''
                }
                title={`${type[variant]} Range End Time`}
                onChange={stateOptionsVariantMap[variant].handleRangeChange}
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
