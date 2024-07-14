import React from 'react';
import {DivisionLayout} from '../../../components';

export function DivisionPageContainer({
  isAdmin,
  children
}: Readonly<{
  isAdmin: boolean;
  children: React.ReactNode;
}>) {
  return (
    <DivisionLayout isAdmin={isAdmin}>
      <div className="flex flex-col flex-wrap justify-center items-center gap-8">
        <h3 className="mt-8 text-2xl">
          <strong>Create CallOut</strong>
        </h3>
        {children}
      </div>
    </DivisionLayout>
  );
}
