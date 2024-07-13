import {employeeListStyles} from './data';

export type ListHeaderProps = {
  title: string;
  titleClassName?: string;
  children: React.ReactNode;
  containerClassName?: string;
};
export function ListHeader({
  title,
  children,
  titleClassName,
  containerClassName
}: Readonly<ListHeaderProps>) {
  return (
    <div className={containerClassName ?? employeeListStyles.div}>
      <h1 className={titleClassName ?? employeeListStyles.h1}>{title}</h1>
      {children}
    </div>
  );
}
