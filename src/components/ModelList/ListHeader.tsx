const defaultStyles = {
  h1: 'w-auto hidden md:flex text-xl font-semibold whitespace-nowrap',
  div: 'w-full flex flex-col md:flex-row justify-center items-center gap-4  bg-tertiary p-2 rounded-md mt-6'
};

export type ModelListHeaderProps = {
  title?: string;
  titleClassName?: string;
  children: React.ReactNode;
  containerClassName?: string;
};

export function ModelListHeader({
  title,
  children,
  titleClassName,
  containerClassName
}: Readonly<ModelListHeaderProps>) {
  return (
    <div className={containerClassName ?? defaultStyles.div}>
      {title && <h1 className={titleClassName ?? defaultStyles.h1}>{title}</h1>}
      {children}
    </div>
  );
}
