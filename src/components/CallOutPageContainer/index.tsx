import React, {useState} from 'react';
import {CallOutWithAssociations} from '../../lib/db/models/types';
import {CallOutForm, DivisionPageContainer, TwoWeekCallOutHistory} from '../../components';

export function CallOutPageContainer(props: {
  employees: string;
  callOuts: string;
  leaveTypes: string;
  isAdmin?: boolean;
}) {
  const [callOuts, setCallOuts] = useState<CallOutWithAssociations[]>(JSON.parse(props.callOuts));
  const addCallout = (callOut: CallOutWithAssociations) => {
    setCallOuts([...callOuts, callOut]);
  };
  return (
    <DivisionPageContainer isAdmin={props.isAdmin ?? false}>
      <CallOutForm
        callback={addCallout}
        employees={props.employees}
        leaveTypes={props.leaveTypes}
      />
      <TwoWeekCallOutHistory callOuts={callOuts} />
    </DivisionPageContainer>
  );
}
