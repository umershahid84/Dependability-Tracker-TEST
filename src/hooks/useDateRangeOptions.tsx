import {useEffect, useState} from 'react';
import {useIsMounted} from './isMounted';

export type DateRangeOptions = 'date' | 'range' | null;

export type UseDateRangeOptions = {
  dateRangeOption: DateRangeOptions;
  setDateRangeOption: React.Dispatch<React.SetStateAction<DateRangeOptions>>;
  handleDateOptionsChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
};

export function useDateRangeOptions(): UseDateRangeOptions {
  const isMounted: boolean = useIsMounted();
  const [dateRangeOption, setDateRangeOption] = useState<DateRangeOptions>(null);

  const handleDateOptionsChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const {value} = e.target;
    setDateRangeOption(value as DateRangeOptions);
  };

  useEffect(() => {
    isMounted && setDateRangeOption(null);
  }, [isMounted]);

  return {dateRangeOption, setDateRangeOption, handleDateOptionsChange};
}
