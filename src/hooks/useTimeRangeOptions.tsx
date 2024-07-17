import {useState} from 'react';

export type TimeRangeOptions = 'time' | 'range' | null;

export type UseTimeRangeOptions = {
  timeRangeOption: TimeRangeOptions;
  setTimeRangeOption: React.Dispatch<React.SetStateAction<TimeRangeOptions>>;
  handleTimeOptionsChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
};

export function useTimeRangeOptions() {
  const [timeRangeOption, setTimeRangeOption] = useState<TimeRangeOptions>(null);

  const handleTimeOptionsChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const {value} = e.target;
    setTimeRangeOption(value as TimeRangeOptions);
  };

  return {timeRangeOption, setTimeRangeOption, handleTimeOptionsChange};
}
