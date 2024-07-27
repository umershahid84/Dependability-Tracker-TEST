// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import {Request} from 'express';
import type {NextApiResponse} from 'next';
import {Employee, LeaveType} from '../../../db';
import {getCallOutFromDB} from '../../../db/controller';
import type {ApiData} from '../../../../lib/apiController';
import CallOut, {CallOutWithAssociations} from '../../../../lib/db/models/Callout';

// inviteToken, password, email

export type AdminDashboardData = {
  totalCallOuts: number;
  fiveMostFrequentCallers?: [string, number][];
  fiveMostFrequentCallOutReasons: [string, number][];
  callOutsWithinLastTwelveHours?: CallOutWithAssociations[];
  callOutTrends?: {
    count: any;
    year: string;
    month: string;
  }[];
};

const getCalloutTrendChartData = async (callOuts: CallOutWithAssociations[]) => {
  try {
    // create object with key as year-month and value as count of callOuts
    // to generate a trend chart
    const groupedByMonthAndDate = callOuts.reduce((acc, callout) => {
      const {callout_date} = callout;
      // split the date to get the year and month
      const [year, month] = callout_date.toISOString().split('-');
      // create the unique key
      const key = `${year}-${month}`;

      // if the key does not exist, create it and set the value to 1
      //@ts-ignore
      if (!acc[key]) {
        //@ts-ignore
        acc[key] = 1;
      } else {
        // key found increment the value
        //@ts-ignore
        acc[key] += 1;
      }
      // return the accumulator
      return acc;
    }, {});

    // used to convert the month number to the month name
    const months = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December'
    ];

    const sortedByMonthArray = Object.entries(groupedByMonthAndDate)
      .map(([date, count]) => {
        const [year, month] = date.split('-');
        return {
          month: months[parseInt(month) - 1],
          year,
          count
        };
      })
      .sort((a, b) => {
        if (a.year === b.year) {
          return months.indexOf(a.month) - months.indexOf(b.month);
        }
        return parseInt(a.year) - parseInt(b.year);
      });

    return sortedByMonthArray;
  } catch (error) {
    console.error(`❌Error in the get callout trend chart data route:\n ${error}`);
    return [];
  }
};

export default async function getAdminDashboardDataApiHandler( //NOSONAR
  req: Request,
  res: NextApiResponse<ApiData<AdminDashboardData>>
) {
  try {
    const leaveTypes = await LeaveType.findAll();
    const employeeCallOutFrequencyMap: Record<string, number> = {};
    const numberOfLeaveTypeOccurrenceMap: Record<string, number> = {};
    const callOuts = (await getCallOutFromDB.all()) as CallOutWithAssociations[];

    // for each leave type count the number of times there is a callout with that leave type as a reason
    for (const leaveType of leaveTypes) {
      const leaveTypeCallOuts = await CallOut.count({
        where: {
          leave_type_id: leaveType.id
        }
      });
      numberOfLeaveTypeOccurrenceMap[leaveType.reason] = leaveTypeCallOuts;
    }

    for (const callOut of callOuts) {
      if (employeeCallOutFrequencyMap[callOut.employee.id]) {
        employeeCallOutFrequencyMap[callOut.employee.id]++;
      } else {
        employeeCallOutFrequencyMap[callOut.employee.id] = 1;
      }
    }

    const fiveMostFrequentCallOutReasons = Object.entries(numberOfLeaveTypeOccurrenceMap)
      .toSorted(([, count]) => count)
      .slice(0, 5);

    const fiveMostFrequentCallers = Object.entries(employeeCallOutFrequencyMap)
      .toSorted(([, count]) => count)
      .slice(0, 5)
      .map(async ([employeeId, count]) => {
        const employee = await Employee.findByPk(employeeId);
        if (employee) {
          employeeId = employee.name;
        }

        return [employeeId, count];
      });

    const callOutsWithinLastTwelveHours = (await getCallOutFromDB.all({
      callout_date_range: [new Date(Date.now() - 12 * 60 * 60 * 1000), new Date()]
    })) as CallOutWithAssociations[];

    return res.status(200).json({
      data: {
        totalCallOuts: callOuts.length,
        fiveMostFrequentCallOutReasons,
        callOutsWithinLastTwelveHours,
        callOutTrends: await getCalloutTrendChartData(callOuts),
        //@ts-ignore
        fiveMostFrequentCallers: await Promise.all(fiveMostFrequentCallers)
      }
    });
  } catch (error) {
    console.error('Error in getCallOutsApiHandler:', error);
    return res.status(500).json({error: String(error)});
  }
}

export {getAdminDashboardDataApiHandler};
