import {FormLabel} from './FormLabel';

export function InputContainer({
  label,
  children,
  htmlFor
}: Readonly<{label: string; children: React.ReactNode; htmlFor: string}>) {
  return (
    <div className="flex flex-col w-full ">
      <FormLabel label={label} htmlFor={htmlFor} className={'font-medium mb-1'} />
      {children}
    </div>
  );
}
