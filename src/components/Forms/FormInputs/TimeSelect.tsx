import { InputContainer } from './InputContainer';

export type TimeSelectProps = {
  time: string;
  name?: string;
  label?: string;
  className?: string;
  onChangeHandler: (e: React.ChangeEvent<HTMLSelectElement>) => void;
};

/**
 * Generate time options in 15-minute intervals for the entire day
 * Returns array of { value: "HH:MM:SS", label: "h:MM AM/PM" }
 */
function generateTimeOptions() {
  const options: Array<{ value: string; label: string }> = [];
  
  for (let hour = 0; hour < 24; hour++) {
    for (let minute = 0; minute < 60; minute += 15) {
      // Format for storage (24-hour format: HH:MM:SS)
      const value = `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}:00`;
      
      // Format for display (12-hour format with AM/PM)
      const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
      const ampm = hour < 12 ? 'AM' : 'PM';
      const label = `${displayHour}:${String(minute).padStart(2, '0')} ${ampm}`;
      
      options.push({ value, label });
    }
  }
  
  return options;
}

export function TimeSelect({
  className,
  label,
  name,
  time,
  onChangeHandler
}: Readonly<TimeSelectProps>) {
  const timeOptions = generateTimeOptions();
  
  return (
    <InputContainer label={label ?? 'Time'} htmlFor={name ?? 'time'}>
      <select
        required
        value={time}
        name={name ?? 'time'}
        title={label ?? 'Time'}
        className={className ?? 'border p-2 rounded-md bg-tertiary'}
        onChange={onChangeHandler}
      >
        <option value="">Select time...</option>
        {timeOptions.map(({ value, label }) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </select>
    </InputContainer>
  );
}
