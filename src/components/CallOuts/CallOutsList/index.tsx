import {
  UseLeaveTypes,
  useLeaveTypes,
  useQueryParams,
  UseCallOutsData,
  useCallOutsData
} from '../../../hooks';
import {useState} from 'react';
import {
  defaultStyles,
  RenderCallOutsList,
  defaultCallOutsQueryParams,
  UseDbSearchParamsFormState,
  useDbSearchParamsFormState
} from './helpers';
import {ModalAction, ModalType} from '../../ Modal';
import {ModelList, ModelListHeader} from '../../ModelList';
import {PaginationContainer} from '../../Pagination/Container';
import {ActiveSearchParams, DynamicSortOptions} from '../../Forms';
import {callOutLimitOptions, callOutSortBy, CallOutSortBy, showLastOptions} from './data';

const getEmployees = async () => {
  const response = await fetch('/api/admin/employees');
  const data = await response.json();
  return data?.data?.data ?? [];
};

export function CallOutsList() {
  const {leaveTypes}: UseLeaveTypes = useLeaveTypes();
  const [showLast, setShowLast] = useState<number | null>(14);
  const [sortBy, setSortBy] = useState<CallOutSortBy>('leaveType');

  const {searchParams, setSearchParams, handleSearchParamsChange}: UseDbSearchParamsFormState =
    useDbSearchParamsFormState();
  const {queryParams, setQueryParams, handleQueryParamChange} = useQueryParams<CallOutSortBy>(
    defaultCallOutsQueryParams
  );

  const {callOuts}: UseCallOutsData = useCallOutsData(queryParams, searchParams, showLast);

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
  };

  const handleAdvancedSearchOnClick = async (e: React.SyntheticEvent) => {
    window.dispatchEvent(
      new CustomEvent('modalEvent', {
        detail: {
          action: ModalAction.OPEN,
          type: ModalType.ADVANCED_CALLOUT_SEARCH,
          payload: {
            dbSearchParams: {searchParams, setSearchParams, handleSearchParamsChange},
            employees: await getEmployees(),
            leaveTypes,
            modalClasses: 'bg-gray-800 p-8 rounded-md shadow-lg relative w-auto '
          }
        }
      })
    );
  };

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
            onSortChange={handleQueryParamChange}
            currentSort={String(queryParams.limit ?? 5)}
            title="Limit the number of CallOuts displayed."
          />

          <button type="button" onClick={handleAdvancedSearchOnClick}>
            🔎 Advanced Search
          </button>
        </span>
      </ModelListHeader>

      <ActiveSearchParams
        dbSearchParams={{searchParams, setSearchParams, handleSearchParamsChange}}
      />

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
