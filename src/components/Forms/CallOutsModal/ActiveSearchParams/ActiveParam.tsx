import {useState} from 'react';
import {CloseIcon} from '../../../Icons';

const styles = {
  p: 'p-2 bg-gray-800 rounded-md',
  activeParam: 'px-3 py-4 rounded-md text-gray-300 relative',
  iconStyles: 'w-5 h-5 absolute right-1 top-1 cursor-pointer hover:text-red-500'
};

export type ActiveParamProps = {
  // an entry in the searchParams object
  activeParam: {
    [key: string]:
      | string
      | number
      | Date
      | [Date, Date]
      | [string, string]
      | [number, number]
      | null;
  };

  onRemove: (key: string) => void;
};
export function ActiveParam({activeParam, onRemove}: Readonly<ActiveParamProps>) {
  const [key, value] = Object.entries(activeParam)[0];
  const [isHovered, setIsHovered] = useState<boolean>(false);

  return (
    <li //NOSONAR
      className={styles.activeParam}
      onMouseOver={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onFocus={() => setIsHovered(true)}
      onBlur={() => setIsHovered(false)}>
      {isHovered && <CloseIcon onClick={() => onRemove(key)} className={styles.iconStyles} />}
      <p className={styles.p}>
        {key}: {typeof value === 'string' ? value : value?.toString()}
      </p>
    </li>
  );
}
