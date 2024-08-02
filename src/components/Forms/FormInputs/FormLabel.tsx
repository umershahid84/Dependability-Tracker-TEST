export type EmployeeModalFormLabelProps = {
  label: string;
  htmlFor: string;
  className?: string;
};
const defaultStyles = 'block font-medium text-primary';
export function FormLabel({
  label,
  htmlFor,
  className = defaultStyles
}: Readonly<EmployeeModalFormLabelProps>): React.ReactElement {
  return (
    <label className={className} htmlFor={htmlFor}>
      {label}
    </label>
  );
}
