import {useState} from 'react';

export type NumberRange = {
  end?: number;
  start?: number;
};

export type UseNumberRange = {
  numberRange: NumberRange;
  setNumberRange: React.Dispatch<React.SetStateAction<NumberRange>>;
  handleNumberRangeChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export function useNumberRange(): UseNumberRange {
  const [numberRange, setNumberRange] = useState<NumberRange>({});

  const handleNumberRangeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {name, value} = e.target;

    setNumberRange(prevState => {
      return {
        ...prevState,
        [name]: Number(value)
      };
    });
  };

  return {numberRange, setNumberRange, handleNumberRangeChange};
}
