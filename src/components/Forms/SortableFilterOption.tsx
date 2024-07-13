export const employeeListStyles = {
  label: 'text-gray-300',
  sortableOption: 'flex items-center space-x-4',
  select: 'px-2 py-1  bg-slate-900 text-gray-100 rounded-md cursor-pointer'
};

export function SortableFilterOption({
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
  sortOptions: {value: string; text: string}[];
  onSortChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
}>) {
  return (
    <div className={employeeListStyles.sortableOption}>
      <label className={employeeListStyles.label}>{label}</label>
      <select
        title={title}
        className={employeeListStyles.select}
        name={name}
        onChange={onSortChange}
        value={currentSort}>
        {sortOptions.map(option => (
          <option key={option.value} value={option.value}>
            {option.text}
          </option>
        ))}
      </select>{' '}
    </div>
  );
}

export default SortableFilterOption;
