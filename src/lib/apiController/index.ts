export * from './admin';

export type ApiData<T = any> = {
  message?: string;
  error?: string;
  data?: T;
};
