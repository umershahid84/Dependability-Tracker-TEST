import {useState} from 'react';

export type NumberRangeOptions = 'number' | 'range' | null;

export type UseNumberRangeOptions = {
  numberRangeOption: NumberRangeOptions;
  setNumberRangeOption: React.Dispatch<React.SetStateAction<NumberRangeOptions>>;
  handleNumberOptionsChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
};

export function useNumberRangeOptions() {
  const [numberRangeOption, setNumberRangeOption] = useState<NumberRangeOptions>(null);

  const handleNumberOptionsChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const {value} = e.target;
    setNumberRangeOption(value as NumberRangeOptions);
  };

  return {numberRangeOption, setNumberRangeOption, handleNumberOptionsChange};
}
