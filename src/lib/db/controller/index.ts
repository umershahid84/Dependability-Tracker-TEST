export * from './Callout';
export * from './Employee';
export * from './Division';
export * from './LeaveType';
export * from './Supervisor';
export * from './CreateCredentialsInvite';

export type PaginationQueryParams<T = any> = {
  sortBy?: T;
  limit?: string;
  offset?: string;
};

export type ModelWithPagination<T> = {
  limit: number;
  offset: number;
  numRecords: number;
  data: T[];
};
