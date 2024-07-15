export * from './admin';
export * from './callouts';

export type ApiData<T = any> = {
  message?: string;
  error?: string;
  data?: T;
};
