import React from 'react';
import {CallOutPageContainer} from '@/components';
import {
  getServerSidePropsForCallOutForm,
  getServerSidePropsForTwoWeekCallOutHistory
} from '@/lib/utils/server';

export const getServerSideProps = async (request: {req: Request}) => {
  const props1 = await getServerSidePropsForCallOutForm(request);
  const props2 = await getServerSidePropsForTwoWeekCallOutHistory(request);

  return {
    props: {
      callOuts: props2.props.callOuts,
      employees: props1.props.employees,
      leaveTypes: props1.props.leaveTypes
    }
  };
};
export default function PublicParkingPage(props: {
  employees: string;
  leaveTypes: string;
  callOuts: string;
}) {
  return (
    <CallOutPageContainer
      callOuts={props.callOuts}
      employees={props.employees}
      leaveTypes={props.leaveTypes}
    />
  );
}
