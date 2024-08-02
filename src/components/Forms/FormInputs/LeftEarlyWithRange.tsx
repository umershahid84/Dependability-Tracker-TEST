import { InputContainer } from './InputContainer';
import { NumberOrRangeInput } from './NumberOrRangeInput';
const styles = {
  inputNumber: 'border p-[5.5px] rounded-md w-full bg-tertiary'
};

export type LeftEarlyWithRangeProps = {
  value: number;
  onChangeHandler: (e: React.ChangeEvent<HTMLInputElement>) => void;
};
export function LeftEarlyWithRange({ value, onChangeHandler }: Readonly<LeftEarlyWithRangeProps>) {
  return (
    <InputContainer label="Left Early (Mins)" htmlFor="leftEarlyMinutes">
      <NumberOrRangeInput
        type="number"
        amount={value}
        name="leftEarlyMinutes"
        label="Left Early (Mins)"
        className={styles.inputNumber}
        onChangeHandler={onChangeHandler}
      />

      <NumberOrRangeInput
        type="range"
        amount={value}
        name="leftEarlyMinutes"
        label="Left Early (Mins)"
        className={styles.inputNumber}
        onChangeHandler={onChangeHandler}
      />
    </InputContainer>
  );
}
