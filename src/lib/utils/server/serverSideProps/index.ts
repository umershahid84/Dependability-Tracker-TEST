import {
  DivisionAttributes,
  LeaveTypeAttributes,
  EmployeeWithAssociations,
  CallOutWithAssociations
} from '@/lib/db/models/types';
import {DefaultLeaveTypes} from '@/lib/db/models';
import {
  getCallOutFromDB,
  getDivisionFromDB,
  getEmployeeFromDB,
  getLeaveTypeFromDB
} from '@/lib/db/controller';
import {getDivisionNameFromPath} from '../../shared/strings';

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

export const getServerSidePropsForCallOutForm = async (request: {req: Request}) => {
  try {
    const currentDivision = getDivisionNameFromPath(request.req.url);
    const division: DivisionAttributes | null = await getDivisionFromDB.byName(currentDivision);

    const divisionEmployees: (EmployeeWithAssociations | null)[] =
      await getEmployeeFromDB.all.byDivision(division?.id ?? '');

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
    console.error('Error in getServerSidePropsForCallOutForm', error);
    return {
      props: {
        employees: JSON.stringify([]),
        leaveTypes: JSON.stringify([])
      }
    };
  }
};

export const getServerSidePropsForTwoWeekCallOutHistory = async (request: {req: Request}) => {
  try {
    const currentDivision = getDivisionNameFromPath(request.req.url);
    const division: DivisionAttributes | null = await getDivisionFromDB.byName(currentDivision);

    // get callOuts for the last two weeks
    const callOuts: (CallOutWithAssociations | null)[] = (
      (await getCallOutFromDB.all({
        shift_date_range: [new Date(Date.now() - 12096e5), new Date(Date.now())]
      })) ?? []
    ).filter(callOut =>
      callOut?.employee?.divisions?.map(div => div.id).includes(division?.id as string)
    );

    return {
      props: {
        callOuts: JSON.stringify(callOuts ?? [])
      }
    };
  } catch (error) {
    console.error('Error in getServerSidePropsForTwoWeekCallOutHistory', error);
    return {
      props: {
        callOuts: JSON.stringify([])
      }
    };
  }
};
