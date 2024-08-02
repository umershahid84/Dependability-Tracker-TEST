import { DynamicOptions } from './DynamicOptions';

export const employeeListStyles = {
  label: 'text-primary print:text-black',
  sortableOption: 'flex items-center space-x-4',
  select: 'px-2 py-1 bg-secondary text-gray-100 print:text-black rounded-md cursor-pointer'
};

export function DynamicSortOptions({
  name,
  label,
  title,
  currentSort,
  sortOptions,
  onSortChange
}: Readonly<{
  name: string;
  label: string;
  title: string;
  currentSort: string;
  sortOptions: { value: string; text: string }[];
  onSortChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
}>) {
  return (
    <div className={employeeListStyles.sortableOption}>
      <label className={employeeListStyles.label}>{label}</label>
      <select
        name={name}
        title={title}
        value={currentSort}
        onChange={onSortChange}
        className={employeeListStyles.select}>
        <DynamicOptions dynamicOptions={sortOptions} />
      </select>{' '}
    </div>
  );
}

export default DynamicSortOptions;
