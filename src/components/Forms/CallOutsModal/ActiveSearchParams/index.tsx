import {ActiveParam} from './ActiveParam';
import type {UseDbSearchParamsFormState} from '../../../CallOuts/CallOutsList/helpers';

const styles = {
  container: 'w-full flex flex-col gap-4',
  activeParam: 'px-3 py-4 rounded-md text-gray-300 relative',
  // iconStyles: 'w-5 h-5 absolute right-1 top-1 cursor-pointer hover:text-red-500 ',
  ul: 'w-auto flex flex-wrap flex-row gap-4 justify-start sm:justify-center items-center'
};

export type ActiveSearchParamsProps = {
  dbSearchParams: UseDbSearchParamsFormState;
};
export function ActiveSearchParams({dbSearchParams}: Readonly<ActiveSearchParamsProps>) {
  const {searchParams, handleSearchParamsChange}: UseDbSearchParamsFormState = dbSearchParams;

  const handleOnRemove = (key: string) => {
    handleSearchParamsChange({
      target: {name: key, value: ''}
    } as React.ChangeEvent<HTMLInputElement>);
  };

  return (
    <div className={styles.container}>
      <ul className={styles.ul}>
        {Object.entries(searchParams).map(([key, value]) => {
          return value ? (
            <ActiveParam key={key} activeParam={{[key]: value}} onRemove={handleOnRemove} />
          ) : // <li //NOSONAR
          //   key={key}
          //   className={styles.activeParam}
          //   onMouseOver={() => setIsHovered(true)}
          //   onMouseLeave={() => setIsHovered(false)}
          //   onFocus={() => setIsHovered(true)}
          //   onBlur={() => setIsHovered(false)}>
          //   {isHovered && (
          //     <CloseIcon onClick={() => handleOnRemove(key)} className={styles.iconStyles} />
          //   )}
          //   <p className="p-2 bg-gray-800 rounded-md">
          //     {key}: {typeof value === 'string' ? value : value?.toString()}
          //   </p>
          // </li>
          undefined;
        })}
      </ul>
    </div>
  );
}
