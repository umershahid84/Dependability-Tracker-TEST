import {
  useIsMounted,
  UseLeaveTypes,
  useLeaveTypes,
  useQueryParams,
  UseGetCallOuts,
  useGetCallOuts
} from '../../../hooks';
import {useEffect, useState} from 'react';
import {ModalAction, ModalType} from '../../ Modal';
import {ModelList, ModelListHeader} from '../../ModelList';
import {PaginationContainer} from '../../Pagination/Container';
import {ActiveSearchParams, DynamicSortOptions} from '../../Forms';
import {defaultStyles, RenderCallOutsList, defaultCallOutsQueryParams} from './helpers';
import {callOutLimitOptions, callOutSortBy, CallOutSortBy, showLastOptions} from './data';
import {CallOutAdvancedSearchContext, useCallOutAdvancedSearchContext} from '../../../providers';

// const getEmployees = async () => {
//   const response = await fetch('/api/admin/employees');
//   const data = await response.json();
//   return data?.data?.data ?? [];
// };

export function CallOutsList() {
  const isMounted: boolean = useIsMounted();
  const [showLast, setShowLast] = useState<number | null>(14);
  const [sortBy, setSortBy] = useState<CallOutSortBy>('leaveType');

  const {searchParams, setExecuteSearch}: CallOutAdvancedSearchContext =
    useCallOutAdvancedSearchContext();

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
      return;
    }
    setShowLast(Number(e.target.value));
    setExecuteSearch(true);
  };

  const queryParamsChangeWrapper = (e: React.ChangeEvent<HTMLSelectElement>) => {
    handleQueryParamChange(e);
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

          <button type="button" onClick={handleAdvancedSearchOnClick}>
            🔎 Advanced Search
          </button>
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
