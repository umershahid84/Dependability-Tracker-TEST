import Loading from '../Loading';
import {useEffect, useState} from 'react';
import {PaginationHeader} from './PaginationHeader';
import {PaginationFooter} from './PaginationFooter';

export type PaginationContainerProps = {
  data: any;
  queryParams: any;
  searchParams?: any;
  setQueryParams: any;
  RenderList: ({data}: Readonly<{data: any}>) => React.JSX.Element[];
};

export function PaginationContainer({
  data,
  RenderList,
  queryParams,
  setQueryParams
}: Readonly<PaginationContainerProps>): React.JSX.Element {
  const [offset, setOffset] = useState<number>(0);
  const [ending, setEnding] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [showing, setShowing] = useState<number>(offset + 1);
  const [numberOfPages, setNumberOfPages] = useState<number>(1);

  const handlePageChange = (
    e: React.SyntheticEvent,
    direction: 'increment' | 'decrement'
  ): void => {
    e.preventDefault();
    e.stopPropagation();

    let newOffset = offset;
    let newCurrentPage = currentPage;

    if (direction === 'increment') {
      if (currentPage === numberOfPages) return;
      newOffset += Number(queryParams.limit);
      newCurrentPage += 1;
    } else {
      if (currentPage === 1) return;
      newOffset -= Number(queryParams.limit);
      newCurrentPage -= 1;
    }

    const currentQueryParams = {...queryParams, offset: String(newOffset)};

    setOffset(newOffset);
    setCurrentPage(newCurrentPage);
    setQueryParams(currentQueryParams);
  };

  const handlePageIncrement = (e: React.SyntheticEvent): void => handlePageChange(e, 'increment');
  const handlePageDecrement = (e: React.SyntheticEvent): void => handlePageChange(e, 'decrement');

  useEffect(() => {
    if (data) {
      let {numRecords, limit} = data;

      if (limit <= 0) {
        limit = numRecords;
      }

      const numPages = Math.ceil(numRecords / Number(limit));
      const _currentPage = Math.ceil(offset / Number(limit)) + 1;
      const _offset = limit * (_currentPage - 1);

      setOffset(_offset);
      setShowing(_offset + 1);
      setNumberOfPages(numPages);
      setCurrentPage(_currentPage);
      setEnding(_offset + data.data.length);
    }

    //eslint-disable-next-line
  }, [data, queryParams]);

  return (
    <div className="w-full h-full flex flex-col gap-4 mt-4">
      {!data ? (
        <Loading />
      ) : (
        <>
          <PaginationHeader
            showing={showing}
            ending={ending}
            currentPage={currentPage}
            numberOfPages={numberOfPages}
            totalNumberOfRecords={data.numRecords}
            handlePageIncrement={handlePageIncrement}
            handlePageDecrement={handlePageDecrement}
          />

          <RenderList data={data?.data ?? []} />

          <PaginationFooter
            currentPage={currentPage}
            numberOfPages={numberOfPages}
            handlePageIncrement={handlePageIncrement}
            handlePageDecrement={handlePageDecrement}
          />
        </>
      )}
    </div>
  );
}
