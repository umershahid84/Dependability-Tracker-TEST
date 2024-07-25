import React from 'react';
import {Request} from 'express';
import {DivisionReport} from '../../../../components';
import {getDivisionFromDB} from '../../../../lib/db/controller';
import type {DivisionAttributes} from '../../../../lib/db/models/types';
import {getServerSidePropsForDivision} from '../../../../lib/utils/server';
import {getTokenForServerSideProps, JwtPayload, Redirect} from '../../../../auth';

export const getServerSideProps = async (request: {req: Request}) => {
  const props1 = await getServerSidePropsForDivision(request);
  const token: JwtPayload | Redirect | undefined = await getTokenForServerSideProps(request);
  const isAdmin = token && 'isAdmin' in token ? token.isAdmin : false;

  const divisions: DivisionAttributes[] = await getDivisionFromDB.all();

  return {
    props: {
      employees: props1.props.employees,
      leaveTypes: props1.props.leaveTypes,
      divisions: JSON.stringify(divisions),
      isAdmin
    }
  };
};

export default function EmployeeCallOutReportsPageForSupervisors(
  props: Readonly<{
    isAdmin: boolean;
    employees: string;
    leaveTypes: string;
    divisions: string;
  }>
) {
  return <DivisionReport {...props} />;
}
