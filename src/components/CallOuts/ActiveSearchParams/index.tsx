import {ActiveParam} from './ActiveParam';
import {CallOutAdvancedSearchContext, useCallOutAdvancedSearchContext} from '../../../providers';

const styles = {
  ul: 'w-full min-h-[40px] mt-3 flex flex-wrap flex-row justify-start sm:justify-center items-center text-sm gap-x-6 gap-y-2'
};

export function ActiveSearchParams() {
  const {searchParams, handleSearchParamsChange, setExecuteSearch}: CallOutAdvancedSearchContext =
    useCallOutAdvancedSearchContext();

  const handleOnRemove = (key: string) => {
    handleSearchParamsChange({
      target: {name: key, value: ''}
    } as React.ChangeEvent<HTMLInputElement>);

    setExecuteSearch(true);
  };

  return (
    <ul className={styles.ul}>
      {Object.entries(searchParams).map(([key, value]) => {
        return value ? (
          <ActiveParam key={key} activeParam={{[key]: value} as any} onRemove={handleOnRemove} />
        ) : undefined;
      })}
    </ul>
  );
}
