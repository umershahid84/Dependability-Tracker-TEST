import {
  TimeRange,
  DateRange,
  NumberRange,
  useDateRange,
  useTimeRange,
  useNumberRange,
  DateRangeOptions,
  TimeRangeOptions,
  NumberRangeOptions,
  useDateRangeOptions,
  useTimeRangeOptions,
  useNumberRangeOptions
} from '../../../../hooks';
import {useEffect, Dispatch, SetStateAction} from 'react';
import {useCallOutAdvancedSearchContext} from '../../../../providers';

export type UseRangeOptionsStateMap = {
  callout_time_range: {
    rangeValue: TimeRange;
    setRangeValue: Dispatch<SetStateAction<TimeRange>>;
    optionValue: TimeRangeOptions;
    setOptionValue: Dispatch<SetStateAction<TimeRangeOptions>>;
    handleRangeChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleOptionChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  };
  shift_time_range: {
    rangeValue: TimeRange;
    setRangeValue: Dispatch<SetStateAction<TimeRange>>;
    optionValue: TimeRangeOptions;
    setOptionValue: Dispatch<SetStateAction<TimeRangeOptions>>;
    handleRangeChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleOptionChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  };
  callout_date_range: {
    rangeValue: DateRange;
    setRangeValue: Dispatch<SetStateAction<DateRange>>;
    optionValue: DateRangeOptions;
    setOptionValue: Dispatch<SetStateAction<DateRangeOptions>>;
    handleRangeChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleOptionChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  };
  shift_date_range: {
    rangeValue: DateRange;
    setRangeValue: Dispatch<SetStateAction<DateRange>>;
    optionValue: DateRangeOptions;
    setOptionValue: Dispatch<SetStateAction<DateRangeOptions>>;
    handleRangeChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleOptionChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  };
  arrived_late_mins_range: {
    rangeValue: NumberRange;
    setRangeValue: Dispatch<SetStateAction<NumberRange>>;
    optionValue: NumberRangeOptions;
    setOptionValue: Dispatch<SetStateAction<NumberRangeOptions>>;
    handleRangeChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleOptionChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  };
  left_early_mins_range: {
    rangeValue: TimeRange;
    setRangeValue: Dispatch<SetStateAction<TimeRange>>;
    optionValue: NumberRangeOptions;
    setOptionValue: Dispatch<SetStateAction<NumberRangeOptions>>;
    handleRangeChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleOptionChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  };
};

export function useRangeOptionsStateMap(): UseRangeOptionsStateMap {
  const {searchParams} = useCallOutAdvancedSearchContext();

  const callOutTimeRange = useTimeRange();
  const shiftTimeRange = useTimeRange();
  const callOutDateRange = useDateRange();
  const shiftDateRange = useDateRange();
  const arrivedLateMinsRange = useNumberRange();
  const leftEarlyMinsRange = useNumberRange();

  const callOutDateRangeOptions = useDateRangeOptions();
  const shiftDateRangeOptions = useDateRangeOptions();
  const callOutTimeRangeOptions = useTimeRangeOptions();
  const shiftTimeRangeOptions = useTimeRangeOptions();
  const arrivedLateMinsRangeOptions = useNumberRangeOptions();
  const leftEarlyMinsRangeOptions = useNumberRangeOptions();

  const stateOptionsVariantMap = {
    callout_time_range: {
      rangeValue: callOutTimeRange.timeRange,
      setRangeValue: callOutTimeRange.setTimeRange,
      optionValue: callOutTimeRangeOptions.timeRangeOption,
      setOptionValue: callOutTimeRangeOptions.setTimeRangeOption,
      handleRangeChange: callOutTimeRange.handleTimeRangeChange,
      handleOptionChange: callOutTimeRangeOptions.handleTimeOptionsChange
    },
    shift_time_range: {
      rangeValue: shiftTimeRange.timeRange,
      setRangeValue: shiftTimeRange.setTimeRange,
      optionValue: shiftTimeRangeOptions.timeRangeOption,
      setOptionValue: shiftTimeRangeOptions.setTimeRangeOption,
      handleRangeChange: shiftTimeRange.handleTimeRangeChange,
      handleOptionChange: shiftTimeRangeOptions.handleTimeOptionsChange
    },
    callout_date_range: {
      rangeValue: callOutDateRange.dateRange,
      setRangeValue: callOutDateRange.setDateRange,
      optionValue: callOutDateRangeOptions.dateRangeOption,
      setOptionValue: callOutDateRangeOptions.setDateRangeOption,
      handleRangeChange: callOutDateRange.handleDateRangeChange,
      handleOptionChange: callOutDateRangeOptions.handleDateOptionsChange
    },
    shift_date_range: {
      rangeValue: shiftDateRange.dateRange,
      setRangeValue: shiftDateRange.setDateRange,
      optionValue: shiftDateRangeOptions.dateRangeOption,
      setOptionValue: shiftDateRangeOptions.setDateRangeOption,
      handleRangeChange: shiftDateRange.handleDateRangeChange,
      handleOptionChange: shiftDateRangeOptions.handleDateOptionsChange
    },
    arrived_late_mins_range: {
      rangeValue: arrivedLateMinsRange.numberRange,
      setRangeValue: arrivedLateMinsRange.setNumberRange,
      optionValue: arrivedLateMinsRangeOptions.numberRangeOption,
      setOptionValue: arrivedLateMinsRangeOptions.setNumberRangeOption,
      handleRangeChange: arrivedLateMinsRange.handleNumberRangeChange,
      handleOptionChange: arrivedLateMinsRangeOptions.handleNumberOptionsChange
    },
    left_early_mins_range: {
      rangeValue: leftEarlyMinsRange.numberRange,
      setRangeValue: leftEarlyMinsRange.setNumberRange,
      optionValue: leftEarlyMinsRangeOptions.numberRangeOption,
      setOptionValue: leftEarlyMinsRangeOptions.setNumberRangeOption,
      handleRangeChange: leftEarlyMinsRange.handleNumberRangeChange,
      handleOptionChange: leftEarlyMinsRangeOptions.handleNumberOptionsChange
    }
  };

  // sets the existing search params to the state on component mount
  useEffect(() => {
    const params = searchParams;

    if (params) {
      if (params.arrived_late_mins) {
        stateOptionsVariantMap.arrived_late_mins_range.setOptionValue('number');
      } else {
        stateOptionsVariantMap.arrived_late_mins_range.setOptionValue(null);
      }

      if (params.arrived_late_mins_range) {
        stateOptionsVariantMap.arrived_late_mins_range.setOptionValue('range');
        stateOptionsVariantMap.arrived_late_mins_range.setRangeValue({
          start: params.arrived_late_mins_range[0],
          end: params.arrived_late_mins_range[1]
        });
      } else {
        stateOptionsVariantMap.arrived_late_mins_range.setRangeValue({});
      }

      if (params.left_early_mins) {
        stateOptionsVariantMap.left_early_mins_range.setOptionValue('number');
      } else {
        stateOptionsVariantMap.left_early_mins_range.setOptionValue(null);
      }

      if (params.left_early_mins_range) {
        stateOptionsVariantMap.left_early_mins_range.setOptionValue('range');
        stateOptionsVariantMap.left_early_mins_range.setRangeValue({
          start: params.left_early_mins_range[0],
          end: params.left_early_mins_range[1]
        });
      } else {
        stateOptionsVariantMap.left_early_mins_range.setRangeValue({});
      }

      if (params.callout_date) {
        stateOptionsVariantMap.callout_date_range.setOptionValue('date');
      } else {
        stateOptionsVariantMap.callout_date_range.setOptionValue(null);
      }

      if (params.callout_date_range) {
        stateOptionsVariantMap.callout_date_range.setOptionValue('range');
        stateOptionsVariantMap.callout_date_range.setRangeValue({
          start: params.callout_date_range[0],
          end: params.callout_date_range[1]
        });
      } else {
        stateOptionsVariantMap.callout_date_range.setRangeValue({});
      }

      if (params.callout_time) {
        stateOptionsVariantMap.callout_time_range.setOptionValue('time');
      } else {
        stateOptionsVariantMap.callout_time_range.setOptionValue(null);
      }

      if (params.callout_time_range) {
        stateOptionsVariantMap.callout_time_range.setOptionValue('range');
        stateOptionsVariantMap.callout_time_range.setRangeValue({
          start: params.callout_time_range[0],
          end: params.callout_time_range[1]
        });
      } else {
        stateOptionsVariantMap.callout_time_range.setRangeValue({});
      }

      if (params.shift_date) {
        stateOptionsVariantMap.shift_date_range.setOptionValue('date');
      } else {
        stateOptionsVariantMap.shift_date_range.setOptionValue(null);
      }

      if (params.shift_date_range) {
        stateOptionsVariantMap.shift_date_range.setOptionValue('range');
        stateOptionsVariantMap.shift_date_range.setRangeValue({
          start: params.shift_date_range[0],
          end: params.shift_date_range[1]
        });
      } else {
        stateOptionsVariantMap.shift_date_range.setRangeValue({});
      }

      if (params.shift_time) {
        stateOptionsVariantMap.shift_time_range.setOptionValue('time');
      } else {
        stateOptionsVariantMap.shift_time_range.setOptionValue(null);
      }

      if (params.shift_time_range) {
        stateOptionsVariantMap.shift_time_range.setOptionValue('range');
        stateOptionsVariantMap.shift_time_range.setRangeValue({
          start: params.shift_time_range[0],
          end: params.shift_time_range[1]
        });
      } else {
        stateOptionsVariantMap.shift_time_range.setRangeValue({});
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  return stateOptionsVariantMap as UseRangeOptionsStateMap;
}
