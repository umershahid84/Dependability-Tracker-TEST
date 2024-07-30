import { Op } from 'sequelize';
import { Request, Response } from 'express';
import type { ApiData } from '../../../../lib/apiController';
import { CallOut, Employee, LeaveType, Supervisor } from '../../../db';
import type { CallOutAttributes, CallOutWithAssociations, EmployeeWithAssociations } from '../../../../lib/db/models/types';

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
]



export const getDashboardData = async (): Promise<AdminDashboardData | null> => {
  try {
    const now = new Date();
    const aYearFromNow = new Date(now);
    const callOuts: Partial<CallOutAttributes>[] = [];
    const leaveTypeFrequency: Record<string, number> = {};
    aYearFromNow.setFullYear(aYearFromNow.getFullYear() - 1);
    const employeeCallOutFrequency: Record<string, number> = {};
    const twelveHoursAgo = new Date(Date.now() - 12 * 60 * 60 * 1000);
    const callOutsWithinLastTwelveHours: CallOutWithAssociations[] = [];
    const callOutTrends: Record<string, { count: number; year: string; month: string }> = {};


    const supervisors = await Supervisor.findAll({
      include: [
        {
          model: Employee,
          as: 'supervisor_info',
        }
      ]
    });

    const supervisorIds: (string | undefined)[] = supervisors.map(supervisor => supervisor.supervisor_info?.id) ?? [];

    const employeesWithCallOuts = (await Employee.findAll({
      attributes: ['id', 'name'],
      include: [{
        model: CallOut,
        as: 'callouts',
        // not include
        attributes: { exclude: ['employee_id', 'supervisor_id', 'leave_type_id'] },
        include: [
          { model: LeaveType, as: 'leaveType', attributes: ['reason'] },
        ],
        where: {
          created_at: {
            [Op.between]: [aYearFromNow, now]
          },
          deleted_at: null
        }
      }],
      where: {
        id: {
          [Op.notIn]: supervisorIds as string[]
        },
      }
    })).map(employee => employee.get({ plain: true })) as unknown as EmployeeWithAssociations[];

    for (const employee of employeesWithCallOuts) {
      const employeeCallOuts = (employee.callouts ?? []) as CallOutWithAssociations[];
      for (const callOut of employeeCallOuts) {
        // Leave type frequency
        const leaveReason = callOut.leaveType.reason;
        leaveTypeFrequency[leaveReason] = (leaveTypeFrequency[leaveReason] || 0) + 1;

        // Employee call-out frequency
        const employeeId = employee.id;
        employeeCallOutFrequency[employeeId] = (employeeCallOutFrequency[employeeId] || 0) + 1;

        // Call-outs within the last twelve hours
        if (callOut.callout_date >= twelveHoursAgo) {
          callOutsWithinLastTwelveHours.push(callOut);
        }

        // Call-out trends
        const calloutDate = callOut.callout_date.toISOString().slice(0, 7); // YYYY-MM
        if (!callOutTrends[calloutDate]) {
          const [year, month] = calloutDate.split('-');
          callOutTrends[calloutDate] = { count: 0, year, month: months[parseInt(month) - 1] };
        }
        callOutTrends[calloutDate].count++;
      }
      callOuts.push(...employeeCallOuts);
    }

    const fiveMostFrequentCallers = Object.entries(employeeCallOutFrequency)
      .sort(([, countA], [, countB]) => countB - countA)
      .slice(0, 5)
      .map(([employeeId, count]) => {
        const employee = employeesWithCallOuts.find(employee => employee.id === employeeId);
        if (employee) {
          return [employee.name, count];
        }
        return [employeeId, count];
      });

    const fiveMostFrequentCallOutReasons = Object.entries(leaveTypeFrequency)
      .sort(([, countA], [, countB]) => countB - countA)
      .slice(0, 5);

    return {
      //@ts-ignore
      fiveMostFrequentCallers,
      callOutsWithinLastTwelveHours,
      totalCallOuts: callOuts.length,
      fiveMostFrequentCallOutReasons: fiveMostFrequentCallOutReasons,
      callOutTrends: Object.values(callOutTrends)
    }
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

    return res.status(200).json({ data });
  } catch (error) {
    console.error('Error in getAdminDashboardDataApiHandler:', error);
    return res.status(500).json({ error: String(error) });
  }
}

export { getAdminDashboardDataApiHandler };
