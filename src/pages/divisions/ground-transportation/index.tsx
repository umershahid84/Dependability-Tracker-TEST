import React from 'react';
import {Request} from 'express';
import {
  getServerSidePropsForDivision,
  getServerSidePropsForTwoWeekCallOutHistory
} from '../../../lib/utils/server';
import {CallOutPageContainer} from '../../../components';
import {getTokenForServerSideProps} from '../../../auth';

export const getServerSideProps = async (request: {req: Request}) => {
  const [props1, props2, token] = await Promise.all([
    getServerSidePropsForDivision(request),
    getServerSidePropsForTwoWeekCallOutHistory(request),
    getTokenForServerSideProps(request)
  ]);
  const isAdmin = token && 'isAdmin' in token ? token.isAdmin : false;

  return {
    props: {
      isAdmin,
      callOuts: props2.props.callOuts,
      employees: props1.props.employees,
      leaveTypes: props1.props.leaveTypes
    }
  };
};

export default function GroundTransportationParkingPage(
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
