import {
  DivisionAttributes,
  LeaveTypeAttributes,
  EmployeeWithAssociations
} from '@/lib/db/models/types';
import {DefaultLeaveTypes} from '@/lib/db/models';
import {getDivisionFromDB, getEmployeeFromDB, getLeaveTypeFromDB} from '@/lib/db/controller';

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
    const path = request.req.url;

    const words = path.split('/divisions/')[1].replace('-', ' ')?.split(' ');

    for (let word of words) {
      word = word.charAt(0).toUpperCase() + word.slice(1);
    }

    const division: DivisionAttributes | null = await getDivisionFromDB.byName(words?.join(' '));

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
    return {
      props: {
        employees: JSON.stringify([]),
        leaveTypes: JSON.stringify([])
      }
    };
  }
};
