import {
  getServerSidePropsForCallOutForm,
  getServerSidePropsForTwoWeekCallOutHistory
} from '../../../lib/utils/server';
import React from 'react';
import {Request} from 'express';
import {CallOutPageContainer} from '../../../components';
import {getTokenForServerSideProps, JwtPayload, Redirect} from '../../../auth';

export const getServerSideProps = async (request: {req: Request}) => {
  const props1 = await getServerSidePropsForCallOutForm(request);
  const props2 = await getServerSidePropsForTwoWeekCallOutHistory(request);
  const token: JwtPayload | Redirect | undefined = await getTokenForServerSideProps(request);
  const isAdmin = token && 'isAdmin' in token ? token.isAdmin : false;

  return {
    props: {
      callOuts: props2.props.callOuts,
      employees: props1.props.employees,
      leaveTypes: props1.props.leaveTypes,
      isAdmin
    }
  };
};
export default function EmployeeParkingPage(
  props: Readonly<{
    isAdmin: boolean;
    callOuts: string;
    employees: string;
    leaveTypes: string;
  }>
) {
  return (
    <CallOutPageContainer
      isAdmin={props.isAdmin}
      callOuts={props.callOuts}
      employees={props.employees}
      leaveTypes={props.leaveTypes}
    />
  );
}
