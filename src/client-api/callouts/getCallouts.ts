import {ApiData} from '../../lib/apiController';
import {CallOutWithAssociations} from '../../lib/db/models/Callout';
import {CallOutSortBy} from '../../components/CallOuts/CallOutsList/data';
import {GetAllCallOutOptions} from '../../lib/db/controller/Callout/helpers';
import {ModelWithPagination, PaginationQueryParams} from '../../lib/db/controller';
import {defaultCallOutsQueryParams} from '../../components/CallOuts/CallOutsList/helpers';

export const GetCallOuts = async (
  queryParams?: PaginationQueryParams<CallOutSortBy>,
  searchParams?: GetAllCallOutOptions,
  showLast?: number | null
): Promise<ApiData<ModelWithPagination<CallOutWithAssociations>>> => {
  try {
    queryParams = queryParams ?? {...defaultCallOutsQueryParams};

    let params: PaginationQueryParams<CallOutSortBy> & {callOutSearchOptions?: string} = {
      ...queryParams
    };

    const hasDateAlready =
      searchParams?.shift_date !== undefined ||
      searchParams?.callout_date !== undefined ||
      searchParams?.shift_date_range !== undefined ||
      searchParams?.callout_date_range !== undefined;

    // add the last x days to the search params if a date range has not already been set
    if (showLast && !hasDateAlready) {
      const date = new Date();
      const start = new Date(date.setDate(date.getDate() - showLast));

      const end = new Date();

      searchParams = {
        ...searchParams,
        created_at_range: [start, end]
      } as GetAllCallOutOptions;
    }

    if (searchParams) {
      params = {
        ...params,
        callOutSearchOptions: JSON.stringify(searchParams)
      } as PaginationQueryParams<CallOutSortBy> & {callOutSearchOptions?: string};
    }

    const response = await fetch(`/api/admin/callouts?${new URLSearchParams(params)}`);
    const data: ApiData<ModelWithPagination<CallOutWithAssociations>> = await response.json();
    if (!response.ok) {
      throw new Error(data.error);
    }
    if (searchParams?.division_id) {
      // filter callOuts by division_id

      if (data?.data?.data) {
        data.data.data = data.data?.data.filter(callOut =>
          callOut.employee.divisions.some(division => division.id === searchParams?.division_id)
        );

        // update the numRecords to reflect the filtered data
        data.data.numRecords = data.data.data.length;
      }
    }
    return data;
  } catch (error) {
    return {
      error: String(error)
    };
  }
};
