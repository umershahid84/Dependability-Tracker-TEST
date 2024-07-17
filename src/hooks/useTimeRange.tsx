import {useState} from 'react';

export type TimeRange = {
  end?: string;
  start?: string;
};

export type UseTimeRange = {
  timeRange: TimeRange;
  handleTimeRangeChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export function useTimeRange() {
  const [timeRange, setTimeRange] = useState<TimeRange>({});

  const handleTimeRangeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {name, value} = e.target;
    setTimeRange(prevState => {
      return {
        ...prevState,
        [name]: value
      };
    });
  };

  return {timeRange, handleTimeRangeChange};
}
