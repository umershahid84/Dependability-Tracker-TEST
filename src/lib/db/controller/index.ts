import {Order} from 'sequelize';

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

export const convertOptions = (
  options: PaginationQueryParams
): {sortBy?: string; limit?: number; offset?: number; order: Order} => {
  const convertedOptions = {
    order: [['createdAt', 'DESC']]
  } as {
    sortBy?: string;
    limit?: number;
    offset?: number;
    order: Order;
  };

  if (options.sortBy) {
    convertedOptions.sortBy = options.sortBy;
    if (options.sortBy === 'name') {
      convertedOptions.order = [['name', 'ASC']];
    }
  }

  if (options.limit) {
    convertedOptions.limit = Number(options.limit);
  }

  if (options.offset) {
    convertedOptions.offset = Number(options.offset);
  }

  return convertedOptions;
};
