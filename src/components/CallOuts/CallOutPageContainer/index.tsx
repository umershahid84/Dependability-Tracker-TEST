import React, {useState} from 'react';
import {CallOutWithAssociations} from '../../../lib/db/models/types';
import {CreateCallOutForm, DivisionPageContainer, TwoWeekCallOutHistory} from '../../../components';

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
        employees={props.employees}
        leaveTypes={props.leaveTypes}
      />
      <TwoWeekCallOutHistory callOuts={callOuts} />
    </DivisionPageContainer>
  );
}
