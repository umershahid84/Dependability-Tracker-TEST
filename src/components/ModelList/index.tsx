export type ModelListContainer = {
  children: React.ReactNode;
};

export function ModelList({children}: Readonly<ModelListContainer>) {
  return (
    <section className="w-full flex flex-col items-center justify-center gap-4">{children}</section>
  );
}

export * from './ListHeader';
