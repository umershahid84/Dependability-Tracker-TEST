import React from 'react';
import {Request} from 'express';
import {DivisionReport} from '../../../../components';
import {getTokenForServerSideProps} from '../../../../auth';
import {getDivisionFromDB} from '../../../../lib/db/controller';
import {getServerSidePropsForDivision} from '../../../../lib/utils/server';

export const getServerSideProps = async (request: {req: Request}) => {
  const [props1, token, divisions] = await Promise.all([
    getServerSidePropsForDivision(request),
    getTokenForServerSideProps(request),
    getDivisionFromDB.all()
  ]);

  const isAdmin = token && 'isAdmin' in token ? token.isAdmin : false;

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
