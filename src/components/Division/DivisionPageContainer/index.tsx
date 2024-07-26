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
      <div className="w-full flex flex-col h-auto flex-wrap justify-center items-center gap-8">
        <h3 className="mt-8 text-2xl hide-on-print">
          <strong>Create CallOut</strong>
        </h3>
        {children}
      </div>
    </DivisionLayout>
  );
}
