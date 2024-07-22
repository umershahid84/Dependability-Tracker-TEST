export type DynamicOption = {
  dynamicOptions: {value: string; text: string}[];
};

export function DynamicOptions({dynamicOptions}: Readonly<DynamicOption>): React.ReactElement {
  return (
    <>
      {dynamicOptions.map(option => (
        <option key={option.value} value={option.value}>
          {option.text}
        </option>
      ))}
    </>
  );
}
