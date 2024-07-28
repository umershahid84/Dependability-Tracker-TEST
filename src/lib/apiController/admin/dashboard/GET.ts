import {Request, Response} from 'express';
import {getCallOutFromDB} from '../../../db/controller';
import type {ApiData} from '../../../../lib/apiController';
import type {CallOutWithAssociations} from '../../../../lib/db/models/types';

export type AdminDashboardData = {
  totalCallOuts: number;
  fiveMostFrequentCallers?: [string, number][];
  fiveMostFrequentCallOutReasons: [string, number][];
  callOutsWithinLastTwelveHours?: CallOutWithAssociations[];
  callOutTrends?: {
    count: number;
    year: string;
    month: string;
  }[];
};

export const getDashboardData = async (): Promise<AdminDashboardData | null> => {
  try {
    const callOuts = (await getCallOutFromDB.all()) as CallOutWithAssociations[];

    const employeeCallOutFrequency: Record<string, number> = {};
    const leaveTypeFrequency: Record<string, number> = {};
    const callOutsWithinLastTwelveHours: CallOutWithAssociations[] = [];
    const callOutTrends: Record<string, {count: number; year: string; month: string}> = {};
    const twelveHoursAgo = new Date(Date.now() - 12 * 60 * 60 * 1000);
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

    for (const callOut of callOuts) {
      // Employee call-out frequency
      const employeeId = callOut.employee.id;
      employeeCallOutFrequency[employeeId] = (employeeCallOutFrequency[employeeId] || 0) + 1;

      // Leave type frequency
      const leaveReason = callOut.leaveType.reason;
      leaveTypeFrequency[leaveReason] = (leaveTypeFrequency[leaveReason] || 0) + 1;

      // Call-outs within the last twelve hours
      if (callOut.callout_date >= twelveHoursAgo) {
        callOutsWithinLastTwelveHours.push(callOut);
      }

      // Call-out trends
      const calloutDate = callOut.callout_date.toISOString().slice(0, 7); // YYYY-MM
      if (!callOutTrends[calloutDate]) {
        const [year, month] = calloutDate.split('-');
        callOutTrends[calloutDate] = {count: 0, year, month: months[parseInt(month) - 1]};
      }
      callOutTrends[calloutDate].count++;
    }

    const fiveMostFrequentCallOutReasons = Object.entries(leaveTypeFrequency)
      .sort(([, countA], [, countB]) => countB - countA)
      .slice(0, 5);

    const fiveMostFrequentCallers = Object.entries(employeeCallOutFrequency)
      .sort(([, countA], [, countB]) => countB - countA)
      .slice(0, 5)
      .map(([employeeId, count]) => {
        const callOut = callOuts.find(callOut => callOut.employee.id === employeeId);
        if (callOut) {
          return [callOut.employee.name, count];
        }
        return [employeeId, count];
      });

    const callOutTrendsArray = Object.values(callOutTrends).sort((a, b) => {
      if (a.year === b.year) {
        return months.indexOf(a.month) - months.indexOf(b.month);
      }
      return parseInt(a.year) - parseInt(b.year);
    });

    return {
      // @ts-ignore
      fiveMostFrequentCallers,
      callOutsWithinLastTwelveHours,
      totalCallOuts: callOuts.length,
      fiveMostFrequentCallOutReasons,
      callOutTrends: callOutTrendsArray
    };
  } catch (error) {
    console.error('Error in getDashboardData:', error);
    return null;
  }
};

export default async function getAdminDashboardDataApiHandler(
  req: Request,
  res: Response<ApiData<AdminDashboardData>>
) {
  try {
    const data = await getDashboardData();

    if (!data) {
      throw new Error('Error fetching data');
    }

    return res.status(200).json({data});
  } catch (error) {
    console.error('Error in getAdminDashboardDataApiHandler:', error);
    return res.status(500).json({error: String(error)});
  }
}

export {getAdminDashboardDataApiHandler};
