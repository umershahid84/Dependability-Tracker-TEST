import {useState} from 'react';
import {PaginationQueryParams} from '../lib/db/controller';

export type UseQueryParams<SortBy> = {
  queryParams: PaginationQueryParams<SortBy>;
  setQueryParams: (queryParams: PaginationQueryParams<SortBy>) => void;
  handleQueryParamChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
};

export function useQueryParams<SortBy>(defaultQueryParams: PaginationQueryParams<SortBy>) {
  const [queryParams, setQueryParams] = useState<PaginationQueryParams<SortBy>>(defaultQueryParams);

  const handleQueryParamChange = (event: React.ChangeEvent<HTMLSelectElement>): void => {
    const {name, value} = event.target;
    const currentQueryParams = {...queryParams, [name]: value};

    setQueryParams(currentQueryParams);
  };

  return {queryParams, setQueryParams, handleQueryParamChange};
}
