import { Request } from 'express';
import {
  getCallOutFromDB,
  getDivisionFromDB,
  getEmployeeFromDB,
  getLeaveTypeFromDB,
  getSupervisorFromDB
} from '../../../../lib/db/controller';
import {
  DivisionAttributes,
  LeaveTypeAttributes,
  CallOutWithAssociations,
  EmployeeWithAssociations,
  SupervisorWithAssociations
} from '../../../../lib/db/models/types';
import { DefaultLeaveTypes } from '../../../../lib/db/models';
import { getDivisionNameFromPath } from '../../shared/strings';
import { logTemplate } from '../logger';

export const defaultLeaveTypes: DefaultLeaveTypes[] = [
  DefaultLeaveTypes.SICK,
  DefaultLeaveTypes.FCA,
  DefaultLeaveTypes.FMLA,
  DefaultLeaveTypes.NO_CALL_NO_SHOW,
  DefaultLeaveTypes.BEREAVEMENT,
  DefaultLeaveTypes.LATE_ARRIVAL,
  DefaultLeaveTypes.LEFT_EARLY,
  DefaultLeaveTypes.LWOP,
  DefaultLeaveTypes.VACATION,
  DefaultLeaveTypes.PERSONAL_HOLIDAY,
  DefaultLeaveTypes.HOLIDAY,
  DefaultLeaveTypes.PHEL,
  DefaultLeaveTypes.JURY_DUTY,
  DefaultLeaveTypes.MATERNITY,
  DefaultLeaveTypes.PATERNITY,
  DefaultLeaveTypes.MILITARY,
  DefaultLeaveTypes.OTHER
];

export const getServerSidePropsForDivision = async (request: { req: Request }) => {
  try {
    const currentDivision = getDivisionNameFromPath(request.req.url);
    const supervisors = (await getSupervisorFromDB.all()) as SupervisorWithAssociations[];
    const division: DivisionAttributes | null = await getDivisionFromDB.byName(currentDivision);
    const supervisorIds = supervisors.map(supervisor => supervisor.supervisor_info.id);

    const divisionEmployees: (EmployeeWithAssociations | null)[] = (
      await getEmployeeFromDB.all.byDivision(division?.id ?? '')
    ).filter(
      // filter out supervisors;
      employee => !supervisorIds.includes(employee?.id)
    );

    const leaveTypes: (LeaveTypeAttributes | null)[] = await getLeaveTypeFromDB.all();

    leaveTypes.sort(
      (a, b) =>
        defaultLeaveTypes.indexOf(a?.reason as DefaultLeaveTypes) -
        defaultLeaveTypes.indexOf(b?.reason as DefaultLeaveTypes)
    );

    return {
      props: {
        employees: JSON.stringify(divisionEmployees),
        leaveTypes: JSON.stringify(leaveTypes)
      }
    };
  } catch (error) {
    const errMessage = '❌ Error in getServerSidePropsForDivision:' + ' ' + error;
    console.error(logTemplate(errMessage, 'error'));
    return {
      props: {
        employees: JSON.stringify([]),
        leaveTypes: JSON.stringify([])
      }
    };
  }
};

export const getServerSidePropsForTwoWeekCallOutHistory = async (request: { req: Request }) => {
  try {
    const currentDivision = getDivisionNameFromPath(request.req.url);
    const division: DivisionAttributes | null = await getDivisionFromDB.byName(currentDivision);

    // get callOuts for the last two weeks
    const callOuts: (CallOutWithAssociations | null)[] = (
      ((await getCallOutFromDB.all({
        created_at_range: [new Date(Date.now() - 12096e5), new Date(Date.now())]
      })) as CallOutWithAssociations[]) ?? []
    ).filter(callOut =>
      callOut?.employee?.divisions?.map(div => div.id).includes(division?.id as string)
    );

    return {
      props: {
        callOuts: JSON.stringify(callOuts ?? [])
      }
    };
  } catch (error) {
    const errMessage = '❌ Error in getServerSidePropsForTwoWeekCallOutHistory:' + ' ' + error;
    console.error(logTemplate(errMessage, 'error'));
    return {
      props: {
        callOuts: JSON.stringify([])
      }
    };
  }
};
