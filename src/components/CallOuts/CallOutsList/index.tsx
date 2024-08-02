import {
  defaultStyles,
  dbSearchParams,
  handleSortChange,
  RenderCallOutsList,
  defaultCallOutsQueryParams
} from './helpers';
import { useEffect, useState } from 'react';
import { DynamicSortOptions } from '../../Forms';
import { ModalAction, ModalType } from '../../Modal';
import { ActiveSearchParams } from '../ActiveSearchParams';
import { ModelList, ModelListHeader } from '../../ModelList';
import { PaginationContainer } from '../../Pagination/Container';
import { ModelWithPagination } from '../../../lib/db/controller';
import { CallOutWithAssociations } from '../../../lib/db/models/types';
import { callOutLimitOptions, callOutSortBy, CallOutSortBy, showLastOptions } from './data';
import { useIsMounted, useQueryParams, UseGetCallOuts, useGetCallOuts } from '../../../hooks';
import { CallOutAdvancedSearchContext, useCallOutAdvancedSearchContext } from '../../../providers';

const styles = {
  modalClasses: 'bg-secondary p-8 rounded-md shadow-lg relative w-auto ',
  button: 'hover:underline hover:underline-offset-4',
  clearSearchButton: 'text-cyan-500 hover:text-red-500 hover:underline hover:underline-offset-4',
  containerClassName:
    'w-full flex flex-col justify-center items-center gap-4  bg-tertiary p-2 rounded-md mt-6 relative -mb-12'
};

export function CallOutsList() {
  const isMounted: boolean = useIsMounted();
  const [showLast, setShowLast] = useState<number | null>(14);
  const [calloutData, setCalloutData] =
    useState<ModelWithPagination<CallOutWithAssociations> | null>(null);
  const [sortBy, setSortBy] = useState<CallOutSortBy>('createdAt');

  const {
    leaveTypes,
    searchParams,
    setSearchParams,
    setExecuteSearch
  }: CallOutAdvancedSearchContext = useCallOutAdvancedSearchContext();

  const hasParams = Object.values(searchParams).some(value => value !== undefined);
  const { queryParams, setQueryParams, handleQueryParamChange } = useQueryParams<CallOutSortBy>(
    defaultCallOutsQueryParams
  );

  const { callOuts }: UseGetCallOuts = useGetCallOuts({
    showLast,
    queryParams
  });

  const onModalEditCallBack = (callout: CallOutWithAssociations) => {
    // find the callout in the callouts array and update it
    const updatedCallOuts: CallOutWithAssociations[] =
      calloutData?.data.map(callOut => {
        if (callOut.id === callout.id) {
          return callout;
        }
        return callOut;
      }) ?? [];

    setCalloutData({
      ...(callOuts as ModelWithPagination<CallOutWithAssociations>),
      data: updatedCallOuts
    });

    window.dispatchEvent(new CustomEvent('modalEvent', { detail: { action: ModalAction.CLOSE } }));
  };

  const onModalDeleteCallBack = (calloutId: string) => {
    // filter out the callout that was deleted
    const updatedCallOuts: CallOutWithAssociations[] =
      calloutData?.data.filter(callOut => callOut.id !== calloutId) ?? [];

    setCalloutData({
      ...(callOuts as ModelWithPagination<CallOutWithAssociations>),
      data: updatedCallOuts
    });

    window.dispatchEvent(new CustomEvent('modalEvent', { detail: { action: ModalAction.CLOSE } }));
  };

  const executeSearch = () => setExecuteSearch(true);
  const handleOnSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    callOuts && handleSortChange({ e, callOuts, setSortBy, setCallOuts: setCalloutData, leaveTypes });
  };

  const handleShowLastChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (e.target.value === 'all') {
      setShowLast(null);
    } else {
      setShowLast(Number(e.target.value));
    }
    executeSearch();
  };

  const queryParamsChangeWrapper = (e: React.ChangeEvent<HTMLSelectElement>) => {
    handleQueryParamChange(e);
    executeSearch();
  };

  const handleClearSearch = (e: React.SyntheticEvent) => {
    e.preventDefault();
    e.stopPropagation();

    setSearchParams({ ...dbSearchParams });
    executeSearch();
  };

  const handleAdvancedSearchOnClick = async (e: React.SyntheticEvent) => {
    window.dispatchEvent(
      new CustomEvent('modalEvent', {
        detail: {
          action: ModalAction.OPEN,
          type: ModalType.ADVANCED_CALLOUT_SEARCH,
          payload: {
            modalClasses: 'bg-tertiary p-8 rounded-md shadow-lg relative w-auto '
          }
        }
      })
    );
  };

  const handleSetQueryParams = (params: any) => {
    setQueryParams(params);
    executeSearch();
  };

  useEffect(() => {
    if (isMounted) {
      executeSearch();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMounted]);

  useEffect(() => {
    callOuts?.data &&
      handleOnSortChange({ target: { value: sortBy } } as React.ChangeEvent<HTMLSelectElement>);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [callOuts?.data]);

  return (
    <ModelList>
      <ModelListHeader
        containerClassName={styles.containerClassName}>
        <span className={defaultStyles.span}>
          <span className='w-full md:w-auto flex flex-wrap flex-row justify-between items-center gap-2'>
            <DynamicSortOptions
              label="Sort By:"
              name="sortBy"
              sortOptions={callOutSortBy}
              onSortChange={handleOnSortChange}
              currentSort={sortBy as string}
              title="Sort the CallOuts by the selected option."
            />

            <DynamicSortOptions
              label="Show:"
              name="showLast"
              sortOptions={showLastOptions}
              onSortChange={handleShowLastChange}
              currentSort={showLast ? String(showLast) : 'all'}
              title="Show all the CallOuts in for the selected number of days."
            />
          </span>
          <span className='w-full md:w-auto flex flex-wrap flex-row justify-between items-center gap-4'>
            <DynamicSortOptions
              label="Limit:"
              name="limit"
              sortOptions={callOutLimitOptions}
              onSortChange={queryParamsChangeWrapper}
              currentSort={String(queryParams.limit ?? 5)}
              title="Limit the number of CallOuts displayed."
            />

            <span>
              🔎{' '}
              <button className={styles.button} type="button" onClick={handleAdvancedSearchOnClick}>
                Advanced Search
              </button>
            </span>

            {hasParams && (
              <button className={styles.clearSearchButton} type="button" onClick={handleClearSearch}>
                Clear Search
              </button>
            )}
          </span>
        </span>

      </ModelListHeader>

      <ActiveSearchParams />

      <PaginationContainer
        data={calloutData}
        queryParams={queryParams}
        searchParams={searchParams}
        //@ts-ignore
        setQueryParams={handleSetQueryParams}
        RenderList={RenderCallOutsList as any}
        onModalEditCallBack={onModalEditCallBack}
        onModalDeleteCallBack={onModalDeleteCallBack}
      />
    </ModelList>
  );
}
