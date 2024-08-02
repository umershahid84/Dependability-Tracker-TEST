import { dateTo_YYYY_MM_DD } from '../../../../lib/utils';
import { UseRangeOptionsStateMap } from './useRangeOptionsVariantMap';
import type { GetAllCallOutOptions } from '../../../../lib/db/controller/Callout/helpers';

export enum RangeOptionsVariant {
  CALL_DATE = 'callout_date_range',
  CALLOUT_TIME = 'callout_time_range',
  SHIFT_DATE = 'shift_date_range',
  SHIFT_TIME = 'shift_time_range',
  ARRIVED_LATE = 'arrived_late_mins_range',
  LEFT_EARLY = 'left_early_mins_range'
}

export const rangeOptionsStyles = {
  relative: 'relative',
  col90: 'w-[90%] flex flex-col ml-8',

  form: 'grid grid-cols-1 gap-4 w-full',
  buttonContainer: 'w-full flex justify-end',
  h2: 'text-2xl font-bold mb-4 text-center mt-2',
  formLabel: 'block font-medium text-primary mt-2',
  rangeLabelSpan: 'w-full flex flex-row justify-end',
  formLabelMr: 'block font-medium text-primary mr-2',
  formLabelMt: 'block font-medium text-primary mt-2',
  label: 'font-medium mb-2 underline underline-offset-4',
  optionsContainer: 'w-full flex flex-col justify-start',
  input: 'border p-2 rounded-md w-full bg-tertiary text-primary',
  inputWithMargin: 'mr-2 h-4 w-4  border-gray-300 rounded bg-tertiary',
  button: 'bg-blue-600 text-primary rounded-md py-2 px-4 hover:bg-blue-500',
  clearButton:
    'border border-gray-300 p-[3px] w-14 rounded-md hover:border-red-600 hover:text-red-600 absolute top-1 right-1'
};

export type RangeOptionsProps = {
  clearRangeOptions: boolean;
  variant: RangeOptionsVariant;
  searchParams: GetAllCallOutOptions;
  stateOptionsVariantMap: UseRangeOptionsStateMap;
  setSearchParams: React.Dispatch<React.SetStateAction<GetAllCallOutOptions>>;
  handleSearchParamsChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
};

export const rangeOptionsVariantMap = {
  type: {
    callout_time_range: 'Call Time',
    shift_time_range: 'Shift Time',
    shift_date_range: 'Shift Date',
    callout_date_range: 'Call Date',
    left_early_mins_range: 'Left Early',
    arrived_late_mins_range: 'Arrived Late'
  },
  dbSearchParamsName: {
    callout_time_range: 'callout_time_range',
    shift_time_range: 'shift_time_range',
    shift_date_range: 'shift_date_range',
    callout_date_range: 'callout_date_range',
    left_early_mins_range: 'left_early_mins_range',
    arrived_late_mins_range: 'arrived_late_mins_range'
  },
  label: {
    callout_time_range: 'Call Time Options',
    shift_time_range: 'Shift Time Options',
    shift_date_range: 'Shift Date Options',
    callout_date_range: 'Call Date Options',
    left_early_mins_range: 'Left Early Options',
    arrived_late_mins_range: 'Arrived Late Options'
  },
  value: {
    callout_time_range: 'Select Call Time Options',
    shift_time_range: 'Select Shift Time Options',
    shift_date_range: 'Select Shift Date Options',
    callout_date_range: 'Select Call Date Options',
    left_early_mins_range: 'Select Left Early Options',
    arrived_late_mins_range: 'Select Arrived Late Options'
  },
  time: {
    callout_time_range: 'By Call Time',
    shift_time_range: 'By Shift Time',
    shift_date_range: 'By Shift Date',
    callout_date_range: 'By Call Date',
    left_early_mins_range: 'By Amount in Mins',
    arrived_late_mins_range: 'By Amount in Mins'
  },
  range: {
    callout_time_range: 'By Call Time Range',
    shift_time_range: 'By Shift Time Range',
    shift_date_range: 'By Shift Date Range',
    callout_date_range: 'By Call Date Range',
    left_early_mins_range: 'By Range of Minutes',
    arrived_late_mins_range: 'By Range of Minutes'
  },
  timeRangeOptionLabel: {
    callout_time_range: {
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
    },
    left_early_mins_range: {
      true: 'Left Early Options',
      false: 'Select Left Early Options'
    },
    arrived_late_mins_range: {
      true: 'Arrived Late Options',
      false: 'Select Arrived Late Options'
    }
  },
  dbSearchParam_NonRange: {
    callout_time_range: 'callout_time',
    shift_time_range: 'shift_time',
    shift_date_range: 'shift_date',
    callout_date_range: 'callout_date',
    left_early_mins_range: 'left_early_mins',
    arrived_late_mins_range: 'arrived_late_mins'
  },
  inputType: {
    callout_time_range: 'time',
    shift_time_range: 'time',
    shift_date_range: 'date',
    callout_date_range: 'date',
    left_early_mins_range: 'number',
    arrived_late_mins_range: 'number'
  },
  optionValues: {
    callout_time_range: ['time', 'range'],
    shift_time_range: ['time', 'range'],
    shift_date_range: ['date', 'range'],
    callout_date_range: ['date', 'range'],
    left_early_mins_range: ['number', 'range'],
    arrived_late_mins_range: ['number', 'range']
  },
  valueFormatter: {
    callout_time_range: (value: string) => value,
    shift_time_range: (value: string) => value,
    left_early_mins_range: (value: string) => value,
    arrived_late_mins_range: (value: string) => value,
    shift_date_range: (value: Date) => dateTo_YYYY_MM_DD(value),
    callout_date_range: (value: Date) => dateTo_YYYY_MM_DD(value)
  }
};
