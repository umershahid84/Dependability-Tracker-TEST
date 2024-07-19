import {ActiveParam} from './ActiveParam';
import {CallOutAdvancedSearchContext, useCallOutAdvancedSearchContext} from '../../../../providers';

const styles = {
  container: 'w-full flex flex-col gap-4',
  activeParam: 'px-3 py-4 rounded-md text-gray-300 relative',
  ul: 'w-auto flex flex-wrap flex-row gap-4 justify-start sm:justify-center items-center'
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
    <div className={styles.container}>
      <ul className={styles.ul}>
        {Object.entries(searchParams).map(([key, value]) => {
          return value ? (
            <ActiveParam key={key} activeParam={{[key]: value}} onRemove={handleOnRemove} />
          ) : undefined;
        })}
      </ul>
    </div>
  );
}
