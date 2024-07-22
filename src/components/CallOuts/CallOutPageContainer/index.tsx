import React, {useState} from 'react';
import {CreateCallOutForm} from '../../Forms/';
import {CallOutWithAssociations} from '../../../lib/db/models/types';
import {DivisionPageContainer, TwoWeekCallOutHistory} from '../../Division';

export function CallOutPageContainer(
  props: Readonly<{
    employees: string;
    callOuts: string;
    leaveTypes: string;
    isAdmin?: boolean;
  }>
) {
  const [callOuts, setCallOuts] = useState<CallOutWithAssociations[]>(JSON.parse(props.callOuts));
  const addCallout = (callOut: CallOutWithAssociations) => {
    setCallOuts([callOut, ...callOuts]);
  };
  return (
    <DivisionPageContainer isAdmin={props.isAdmin ?? false}>
      <CreateCallOutForm
        callback={addCallout}
        employees={JSON.parse(props.employees)}
        leaveTypes={JSON.parse(props.leaveTypes)}
      />
      <TwoWeekCallOutHistory callOuts={callOuts} />
    </DivisionPageContainer>
  );
}
