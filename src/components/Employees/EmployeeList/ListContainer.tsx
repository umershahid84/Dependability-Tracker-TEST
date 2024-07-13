import {employeeListStyles} from './data';

export type ListContainerProps = {
  children: React.ReactNode;
};
export function ListsContainer({children}: Readonly<ListContainerProps>) {
  return <section className={employeeListStyles.section}>{children}</section>;
}
