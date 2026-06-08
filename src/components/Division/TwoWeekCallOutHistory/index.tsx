'use client';
import {CallOutWithAssociations} from '../../../lib/db/models/Callout';
import {DetailedCallOutHistory} from '../../DivisionReport/DetailedCallOutReport';

export function TwoWeekCallOutHistory({
  callOuts,
  onModalEditCallBack
}: Readonly<{
  callOuts: CallOutWithAssociations[];
  onModalEditCallBack?: (callOut: CallOutWithAssociations) => void;
}>) {
  return callOuts.length > 0 ? (
    <DetailedCallOutHistory callOuts={callOuts} onModalEditCallBack={onModalEditCallBack} />
  ) : (
    <></>
  );
}
