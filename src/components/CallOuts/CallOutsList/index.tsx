import {
  defaultStyles,
  dbSearchParams,
  RenderCallOutsList,
  defaultCallOutsQueryParams
} from './helpers';
import {useEffect, useState} from 'react';
import {DynamicSortOptions} from '../../Forms';
import {ModalAction, ModalType} from '../../ Modal';
import {ActiveSearchParams} from '../ActiveSearchParams';
import {ModelList, ModelListHeader} from '../../ModelList';
import {PaginationContainer} from '../../Pagination/Container';
import {callOutLimitOptions, callOutSortBy, CallOutSortBy, showLastOptions} from './data';
import {useIsMounted, useQueryParams, UseGetCallOuts, useGetCallOuts} from '../../../hooks';
import {CallOutAdvancedSearchContext, useCallOutAdvancedSearchContext} from '../../../providers';

export function CallOutsList() {
  const isMounted: boolean = useIsMounted();
  const [showLast, setShowLast] = useState<number | null>(14);
  const [sortBy, setSortBy] = useState<CallOutSortBy>('leaveType');

  const {searchParams, setExecuteSearch, setSearchParams}: CallOutAdvancedSearchContext =
    useCallOutAdvancedSearchContext();

  const hasParams = Object.values(searchParams).some(value => value !== undefined);

  const {queryParams, setQueryParams, handleQueryParamChange} = useQueryParams<CallOutSortBy>(
    defaultCallOutsQueryParams
  );

  const {callOuts}: UseGetCallOuts = useGetCallOuts({
    showLast,
    queryParams
  });

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortBy(e.target.value as CallOutSortBy);
    // sort the callOuts by the selected option
  };

  const handleShowLastChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (e.target.value === 'all') {
      setShowLast(null);
    } else {
      setShowLast(Number(e.target.value));
    }

    setExecuteSearch(true);
  };

  const queryParamsChangeWrapper = (e: React.ChangeEvent<HTMLSelectElement>) => {
    handleQueryParamChange(e);
    setExecuteSearch(true);
  };

  const handleClearSearch = (e: React.SyntheticEvent) => {
    e.preventDefault();
    e.stopPropagation();

    setSearchParams({...dbSearchParams});
    setExecuteSearch(true);
  };

  const handleAdvancedSearchOnClick = async (e: React.SyntheticEvent) => {
    window.dispatchEvent(
      new CustomEvent('modalEvent', {
        detail: {
          action: ModalAction.OPEN,
          type: ModalType.ADVANCED_CALLOUT_SEARCH,
          payload: {
            modalClasses: 'bg-gray-800 p-8 rounded-md shadow-lg relative w-auto '
          }
        }
      })
    );
  };

  useEffect(() => {
    if (isMounted) {
      setExecuteSearch(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMounted]);

  return (
    <ModelList>
      <ModelListHeader containerClassName="w-full flex flex-col justify-center items-center gap-4  bg-gray-800 p-2 rounded-md mt-6 relative">
        <span className={defaultStyles.span}>
          <DynamicSortOptions
            label="Sort By:"
            name="sortBy"
            sortOptions={callOutSortBy}
            onSortChange={handleSortChange}
            currentSort={sortBy}
            title="Sort the CallOuts by the selected option."
          />

          <DynamicSortOptions
            label="Show Last:"
            name="showLast"
            sortOptions={showLastOptions}
            onSortChange={handleShowLastChange}
            currentSort={showLast ? String(showLast) : 'all'}
            title="Show all the CallOuts in for the selected number of days."
          />

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
            <button
              className="hover:underline hover:underline-offset-4"
              type="button"
              onClick={handleAdvancedSearchOnClick}>
              Advanced Search
            </button>
          </span>

          {hasParams && (
            <button
              className="text-cyan-500 hover:text-red-500 hover:underline hover:underline-offset-4"
              type="button"
              onClick={handleClearSearch}>
              Clear Search
            </button>
          )}
        </span>
      </ModelListHeader>

      <ActiveSearchParams />

      <PaginationContainer
        data={callOuts}
        queryParams={queryParams}
        searchParams={searchParams}
        //@ts-ignore
        RenderList={RenderCallOutsList}
        setQueryParams={setQueryParams}
      />
    </ModelList>
  );
}
