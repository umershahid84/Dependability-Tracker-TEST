import { CallOutWithAssociations } from '../../../lib/db/models/Callout';
import { DetailedCallOutHistory } from '../../DivisionReport/DetailedCallOutReport';

export function TwoWeekCallOutHistory({ callOuts }: Readonly<{ callOuts: CallOutWithAssociations[] }>) {
  return callOuts.length > 0 ? <DetailedCallOutHistory callOuts={callOuts} /> : <></>;
}
