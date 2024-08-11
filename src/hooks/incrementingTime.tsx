import {useIsMounted} from '../hooks';
import {dateTo_HH_MM_SS} from '../lib/utils';
import React, {useEffect, useState} from 'react';

export type UseIncrementingTime = {
  time: string;
  resetTime: () => void;
  setTime: React.Dispatch<React.SetStateAction<string>>;
  clearTimeInterval: () => void;
  handleTimeChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export function useIncrementingTime(): UseIncrementingTime {
  const isMounted = useIsMounted();

  const [time, setTime] = useState<string>(dateTo_HH_MM_SS(new Date()));
  const [timeInterval, setTimeInterval] = useState<NodeJS.Timeout | null>(null);

  const handleClearCallTimeInterval = () => {
    if (timeInterval) {
      clearInterval(timeInterval);
      setTimeInterval(null);
    }
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {value} = e.target;
    handleClearCallTimeInterval();
    setTime(value);
  };

  const startTimeInterval = () => {
    !timeInterval &&
      setTimeInterval(
        setInterval(() => {
          const now = new Date();
          setTime(dateTo_HH_MM_SS(now));
        }, 1000)
      );
  };

  useEffect(() => {
    isMounted && startTimeInterval();
    return () => {
      isMounted && handleClearCallTimeInterval();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMounted]);

  const resetTime = () => {
    handleClearCallTimeInterval();
    startTimeInterval();
  };

  return {
    time,
    setTime,
    resetTime,
    handleTimeChange,
    clearTimeInterval: handleClearCallTimeInterval
  };
}
