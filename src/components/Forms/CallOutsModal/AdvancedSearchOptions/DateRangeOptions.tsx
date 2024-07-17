import {
  useDateRange,
  UseDateRange,
  useDateRangeOptions,
  UseDateRangeOptions
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

export type CallOutDateOptionsProps = {
  variant: DateRangeOptionsVariants;
  dbSearchParamsFormState: UseDbSearchParamsFormState;
};

export enum DateRangeOptionsVariants {
  SHIFT_DATE = 'shift_date_range',
  CALL_DATE = 'callout_date_range'
}

const dateRangeOptionsVariantMap = {
  type: {
    callout_date_range: 'Call Date',
    shift_date_range: 'Shift Date'
  },
  dbSearchParamsName: {
    callout_date_range: 'callout_date_range',
    shift_date_range: 'shift_date_range'
  },
  label: {
    callout_date_range: 'Call Date Options',
    shift_date_range: 'Shift Date Options'
  },
  value: {
    callout_date_range: 'Select Call Date Options',
    shift_date_range: 'Select Shift Date Options'
  },
  date: {
    callout_date_range: 'By Call Date',
    shift_date_range: 'By Shift Date'
  },
  range: {
    callout_date_range: 'By Call Date Range',
    shift_date_range: 'By Shift Date Range'
  },
  dateRangeOptionLabel: {
    callout_date_range: {
      true: 'Call Date Options',
      false: 'Select Call Date Options'
    },
    shift_date_range: {
      true: 'Shift Date Options',
      false: 'Select Shift Date Options'
    }
  },
  dbParamName_NonRange: {
    callout_date_range: 'callout_date',
    shift_date_range: 'shift_date'
  }
};

export function DateRangeOptions({
  variant,
  dbSearchParamsFormState
}: Readonly<CallOutDateOptionsProps>) {
  const {dateRange, handleDateRangeChange}: UseDateRange = useDateRange();
  const {dateRangeOption, setDateRangeOption, handleDateOptionsChange}: UseDateRangeOptions =
    useDateRangeOptions();

  useEffect(() => {
    if (dateRange.start && dateRange.end) {
      dbSearchParamsFormState.handleSearchParamsChange({
        target: {
          name: dateRangeOptionsVariantMap.dbSearchParamsName[variant],
          value: [dateRange.start, dateRange.end]
        }
      } as unknown as React.ChangeEvent<HTMLInputElement>);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dateRange]);

  return (
    <FormLabelContainer addClasses="relative ">
      <label
        htmlFor={dateRangeOptionsVariantMap.label[variant]}
        className="font-medium mb-2 underline underline-offset-4">
        {
          dateRangeOptionsVariantMap.dateRangeOptionLabel[variant][
            dateRangeOption ? `true` : `false`
          ]
        }
      </label>
      {!dateRangeOption ? (
        <select
          name={dateRangeOptionsVariantMap.label[variant]}
          title={dateRangeOptionsVariantMap.label[variant]}
          className={styles.input}
          onChange={handleDateOptionsChange}>
          <option value="">{dateRangeOptionsVariantMap.value[variant]}</option>
          <option value="date">{dateRangeOptionsVariantMap.date[variant]}</option>
          <option value="range">{dateRangeOptionsVariantMap.range[variant]}</option>
        </select>
      ) : (
        <div className="w-full flex flex-col justify-start">
          <button
            type="button"
            onClick={() => setDateRangeOption(null)}
            className="border border-gray-300 p-1  w-16  rounded-md hover:border-red-600 hover:text-red-600 absolute top-2 right-1">
            Clear
          </button>

          {dateRangeOption && dateRangeOption === 'date' ? (
            <div className="w-[90%] flex flex-col ml-8">
              <FormLabel
                label={dateRangeOptionsVariantMap.type[variant]}
                htmlFor={dateRangeOptionsVariantMap.dbParamName_NonRange[variant]}
                className="block font-medium text-gray-300 mt-2"
              />
              <input
                type="date"
                name={dateRangeOptionsVariantMap.dbParamName_NonRange[variant]}
                title={dateRangeOptionsVariantMap.type[variant]}
                value={
                  dateTo_YYYY_MM_DD(
                    (dbSearchParamsFormState.searchParams[
                      dateRangeOptionsVariantMap.dbParamName_NonRange[
                        variant
                      ] as keyof UseDbSearchParamsFormState['searchParams']
                    ] ?? undefined) as Date
                  ) ?? ''
                }
                onChange={dbSearchParamsFormState.handleSearchParamsChange}
                className={styles.input}
              />
            </div>
          ) : (
            <></>
          )}

          {dateRangeOption && dateRangeOption === 'range' ? (
            <div className="w-[90%] flex flex-col ml-8">
              <FormLabel label={`${dateRangeOptionsVariantMap.type[variant]} Range`} htmlFor="" />
              <span className="w-full flex flex-row justify-end">
                <FormLabel
                  label="Start"
                  htmlFor="start"
                  className=" font-medium text-gray-300 mr-2"
                />
              </span>

              <input
                type="date"
                name="start"
                title={`${dateRangeOptionsVariantMap.type[variant]} Range Start Date`}
                value={dateTo_YYYY_MM_DD(dateRange.start) ?? ''}
                onChange={handleDateRangeChange}
                className={styles.input}
              />
              <span className="w-full flex flex-row justify-end">
                <FormLabel label="End" htmlFor="end" className=" font-medium text-gray-300 mr-2" />
              </span>
              <input
                type="date"
                name="end"
                title={`${dateRangeOptionsVariantMap.type[variant]} Range End Date`}
                value={dateTo_YYYY_MM_DD(dateRange.end) ?? ''}
                onChange={handleDateRangeChange}
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
