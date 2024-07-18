import {useState} from 'react';

export type DateRange = {
  end?: Date;
  start?: Date;
};

export type UseDateRange = {
  dateRange: DateRange;
  setDateRange: React.Dispatch<React.SetStateAction<DateRange>>;
  handleDateRangeChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export function useDateRange(): UseDateRange {
  const [dateRange, setDateRange] = useState<DateRange>({});

  const handleDateRangeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {name, value} = e.target;
    setDateRange(prevState => {
      return {
        ...prevState,
        [name]: value
      };
    });
  };

  return {dateRange, setDateRange, handleDateRangeChange};
}
