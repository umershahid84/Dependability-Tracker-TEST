import Loading from '../Loading';
import {useEffect, useState} from 'react';
import {PaginationHeader} from './PaginationHeader';
import {PaginationFooter} from './PaginationFooter';
import {EmployeeWithAssociations} from '../../lib/db/controller';
import {RenderCallOutsListProps} from '../CallOuts/CallOutsList/helpers';
import {SupervisorWithAssociations} from '../../lib/db/models/Supervisor';

export type PaginationContainerProps = {
  data: any;
  queryParams: any;
  searchParams?: any;
  setQueryParams: any;
  onModalDeleteCallBack?:
    | RenderCallOutsListProps['onModalDeleteCallBack']
    | ((employeeId: string) => void)
    | ((supervisorId: string) => void);
  onModalEditCallBack?:
    | RenderCallOutsListProps['onModalEditCallBack']
    | ((employee: EmployeeWithAssociations) => void)
    | ((supervisor: SupervisorWithAssociations) => void);
  RenderList: ({
    data,
    onModalEditCallBack,
    onModalDeleteCallBack
  }: {
    data: any;
    onModalDeleteCallBack?: (
      calloutId: string
    ) => void | ((employeeId: string) => void) | ((supervisorId: string) => void);
    onModalEditCallBack?:
      | RenderCallOutsListProps['onModalEditCallBack']
      | ((employee: EmployeeWithAssociations) => void)
      | ((supervisor: SupervisorWithAssociations) => void);
  }) => React.JSX.Element[];
};

const figureOffset = (offset: number, numRecords: number): number => {
  return numRecords === 0 ? 0 : offset + 1;
};

export function PaginationContainer({
  data,
  RenderList,
  queryParams,
  setQueryParams,
  onModalEditCallBack,
  onModalDeleteCallBack
}: Readonly<PaginationContainerProps>): React.JSX.Element {
  const [offset, setOffset] = useState<number>(0);
  const [ending, setEnding] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [numberOfPages, setNumberOfPages] = useState<number>(1);
  const [showing, setShowing] = useState<number>(figureOffset(offset, data?.numRecords ?? 0));

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
      setCurrentPage(_currentPage);
      setEnding(_offset + data.data.length);
      setNumberOfPages(numPages > 0 ? numPages : 1);
      setShowing(figureOffset(_offset, data?.numRecords ?? 0));
    }

    //eslint-disable-next-line
  }, [data, queryParams]);

  return (
    <div className="w-full h-full flex flex-col gap-4 mt-2">
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

          <RenderList
            data={data?.data ?? []}
            onModalEditCallBack={onModalEditCallBack}
            onModalDeleteCallBack={onModalDeleteCallBack}
          />

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
