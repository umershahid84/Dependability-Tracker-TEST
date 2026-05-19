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
  const employees = JSON.parse(props.employees);
  const leaveTypes = JSON.parse(props.leaveTypes);

  const addCallout = (callOut: CallOutWithAssociations) => {
    setCallOuts([callOut, ...callOuts]);
  };

  const editCallOut = (editedCallOut: CallOutWithAssociations) => {
    setCallOuts(prevCallOuts =>
      prevCallOuts.map(callOut => (callOut.id === editedCallOut.id ? editedCallOut : callOut))
    );
  };

  return (
    <DivisionPageContainer isAdmin={props.isAdmin ?? false}>
      <CreateCallOutForm
        callback={addCallout}
        employees={employees}
        leaveTypes={leaveTypes}
      />
      <TwoWeekCallOutHistory
        callOuts={callOuts}
        onModalEditCallBack={editCallOut}
      />
    </DivisionPageContainer>
  );
}
