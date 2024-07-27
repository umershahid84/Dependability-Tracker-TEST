// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import {Request} from 'express';
import {LeaveType} from '../../../db';
import type {NextApiResponse} from 'next';
import {getCallOutFromDB} from '../../../db/controller';
import type {ApiData} from '../../../../lib/apiController';
import type {CallOutWithAssociations} from '../../../../lib/db/models/types';

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

const getCalloutTrendChartData = (callOuts: CallOutWithAssociations[]) => {
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

export const getDashboardData = async (): Promise<AdminDashboardData | null> => {
  try {
    const employeeCallOutFrequencyMap: Record<string, number> = {};
    const numberOfLeaveTypeOccurrenceMap: Record<string, number> = {};

    const [leaveTypes, callOuts] = await Promise.all([
      LeaveType.findAll(),
      getCallOutFromDB.all() as Promise<CallOutWithAssociations[]>
    ]);

    callOuts.forEach(callOut => {
      const leaveType = leaveTypes.find(type => type.id === callOut.leaveType.id);
      if (leaveType) {
        if (numberOfLeaveTypeOccurrenceMap[leaveType.reason]) {
          numberOfLeaveTypeOccurrenceMap[leaveType.reason]++;
        } else {
          numberOfLeaveTypeOccurrenceMap[leaveType.reason] = 1;
        }
      }
    });

    for (const callOut of callOuts) {
      if (employeeCallOutFrequencyMap[callOut.employee.id]) {
        employeeCallOutFrequencyMap[callOut.employee.id]++;
      } else {
        employeeCallOutFrequencyMap[callOut.employee.id] = 1;
      }
    }

    const fiveMostFrequentCallOutReasons = Object.entries(numberOfLeaveTypeOccurrenceMap)
      .sort(([, countA], [, countB]) => countB - countA)
      .slice(0, 5);

    const fiveMostFrequentCallers = Object.entries(employeeCallOutFrequencyMap)
      .sort(([, countA], [, countB]) => countB - countA)
      .slice(0, 5)
      .map(([employeeId, count]) => {
        const callOut = callOuts.find(callOut => callOut.employee.id === employeeId);
        if (callOut) {
          const employee = callOut.employee;
          employeeId = employee.name;
        }

        return [employeeId, count];
      });

    const callOutsWithinLastTwelveHours = callOuts
      .filter(callOut => {
        const twelveHoursAgo = new Date(Date.now() - 12 * 60 * 60 * 1000);
        return callOut.callout_date >= twelveHoursAgo;
      })
      .map(callOut => {
        // return all the properites but convert any dates to a date string
        return {
          ...callOut,
          createdAt: callOut.createdAt.toISOString(),
          updatedAt: callOut.updatedAt.toISOString(),
          callout_date: callOut.callout_date.toISOString(),
          callout_time: callOut.callout_time.toISOString(),
          employee: {
            ...callOut.employee,
            createdAt: callOut.employee.createdAt.toISOString(),
            updatedAt: callOut.employee.updatedAt.toISOString(),
            divisions: callOut.employee.divisions.map(division => ({
              ...division,
              createdAt: division.createdAt.toISOString(),
              updatedAt: division.updatedAt.toISOString()
            }))
          },
          shift_date: callOut.shift_date.toISOString(),
          shift_time: callOut.shift_time.toISOString(),
          supervisor: {
            ...callOut.supervisor,
            createdAt: callOut.supervisor.createdAt.toISOString(),
            updatedAt: callOut.supervisor.updatedAt.toISOString(),
            supervisor_info: {
              ...callOut.supervisor.supervisor_info,
              createdAt: callOut.supervisor.supervisor_info.createdAt.toISOString(),
              updatedAt: callOut.supervisor.supervisor_info.updatedAt.toISOString(),
              divisions: callOut.supervisor.supervisor_info.divisions.map(division => ({
                ...division,
                createdAt: division.createdAt.toISOString(),
                updatedAt: division.updatedAt.toISOString()
              }))
            }
          },
          leaveType: {
            ...callOut.leaveType,
            createdAt: callOut.leaveType.createdAt.toISOString(),
            updatedAt: callOut.leaveType.updatedAt.toISOString()
          }
        };
      });

    return {
      // @ts-ignore
      fiveMostFrequentCallers,
      // @ts-ignore
      callOutsWithinLastTwelveHours,
      totalCallOuts: callOuts.length,
      fiveMostFrequentCallOutReasons,
      callOutTrends: getCalloutTrendChartData(callOuts)
    };
  } catch (error) {
    console.error('Error in getCallOutsApiHandler:', error);
    return null;
  }
};

export default async function getAdminDashboardDataApiHandler( //NOSONAR
  req: Request,
  res: NextApiResponse<ApiData<AdminDashboardData>>
) {
  try {
    const data = await getDashboardData();

    if (!data) {
      throw new Error('Error fetching data');
    }

    return res.status(200).json({data});
  } catch (error) {
    console.error('Error in getCallOutsApiHandler:', error);
    return res.status(500).json({error: String(error)});
  }
}

export {getAdminDashboardDataApiHandler};
