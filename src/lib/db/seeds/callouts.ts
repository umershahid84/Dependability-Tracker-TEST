import 'dotenv/config';
import {
  LeaveTypeAttributes,
  EmployeeWithAssociations,
  CallOutCreationAttributes,
  SupervisorWithAssociations
} from '../models/types';
import sequelize from '../connection';
import { logTemplate } from '../../utils/server';
import { CallOut, DefaultLeaveTypes } from '../models';
import { getEmployeeFromDB, getLeaveTypeFromDB, getSupervisorFromDB } from '../controller';


const numberOfCallouts = 365;

function getRelevantComments(leaveType: DefaultLeaveTypes): string[] {
  const leaveTypeToComments: { [key in DefaultLeaveTypes]: number[] } = {
    [DefaultLeaveTypes.SICK]: [6, 15, 19, 24, 28, 31, 33, 38, 48],
    [DefaultLeaveTypes.FCA]: [2, 11, 16, 17, 25],
    [DefaultLeaveTypes.FMLA]: [7, 10, 18, 21, 36, 37],
    [DefaultLeaveTypes.NO_CALL_NO_SHOW]: [],
    [DefaultLeaveTypes.BEREAVEMENT]: [9, 11],
    [DefaultLeaveTypes.LATE_ARRIVAL]: [12, 13, 45, 46],
    [DefaultLeaveTypes.LEFT_EARLY]: [3, 13, 30, 35, 45, 46],
    [DefaultLeaveTypes.LWOP]: [],
    [DefaultLeaveTypes.VACATION]: [1, 5, 14, 22, 27, 29],
    [DefaultLeaveTypes.PERSONAL_HOLIDAY]: [8, 17, 30],
    [DefaultLeaveTypes.HOLIDAY]: [],
    [DefaultLeaveTypes.HOLIDAY_OPTION]: [],
    [DefaultLeaveTypes.PHEL]: [0, 4, 6, 20, 33, 38, 48],
    [DefaultLeaveTypes.JURY_DUTY]: [44],
    [DefaultLeaveTypes.MATERNITY]: [34, 32],
    [DefaultLeaveTypes.PATERNITY]: [34],
    [DefaultLeaveTypes.MILITARY]: [],
    [DefaultLeaveTypes.OTHER]: []
  };

  const indices = leaveTypeToComments[leaveType];
  return indices.map(index => supervisorComments[index]);
}

// Sample supervisorComments array
const supervisorComments: string[] = [
  "Personal emergency that couldn't be postponed.",
  'Employee is dealing with a family illness.',
  'Unexpected childcare issues.',
  'Severe weather preventing safe travel.',
  "Medical appointment that couldn't be rescheduled.",
  "Employee's car broke down on the way to work.",
  'Sudden onset of flu-like symptoms.',
  "Employee's home experienced flooding.",
  'Attending a funeral for a close relative.',
  'Employee is recovering from minor surgery.',
  'Mental health day as per company policy.',
  "Employee's child is unwell and needs care.",
  "Unexpected power outage at employee's residence.",
  "Employee's pet is seriously ill.",
  'Employee involved in a minor car accident.',
  'Employee is experiencing severe migraines.',
  'Employee needs to care for a sick parent.',
  'Scheduled house repair requiring presence.',
  'Employee needs to move unexpectedly.',
  "Employee's house caught fire, dealing with aftermath.",
  'Urgent legal matter requiring immediate attention.',
  'Employee is experiencing food poisoning.',
  "Employee's spouse is in the hospital.",
  "Employee's residence is under evacuation due to an emergency.",
  'Employee dealing with severe back pain.',
  "Employee's child has a school emergency.",
  'Employee assisting with a medical emergency for a neighbor.',
  "Employee's immediate family member in a serious accident.",
  'Employee needs to meet with a contractor for emergency repairs.',
  'Employee has a severe allergic reaction.',
  'Employee attending to urgent personal financial matters.',
  'Employee experiencing severe anxiety attacks.',
  "Employee's spouse lost a job, needing support.",
  "Employee's child in a serious accident.",
  "Employee's partner is giving birth.",
  "Employee's house was burglarized, dealing with police.",
  'Employee experiencing unexpected complications from a recent illness.',
  "Employee's home requires immediate plumbing repairs.",
  "Employee's neighborhood is under severe weather advisory.",
  'Employee has a contagious illness.',
  'Employee needs to take care of immediate legal obligations.',
  "Employee's sibling is experiencing a medical emergency.",
  "Employee's house had a gas leak, waiting for resolution.",
  'Employee was called for emergency jury duty.',
  'Employee has an urgent school meeting for their child.',
  "Employee's partner in a minor accident and needs assistance.",
  "Employee's parent has sudden health complications.",
  'Employee needs to deal with a sudden insurance issue.',
  'Employee is having severe dental pain.'
];

// Function to generate a random date within the past year
function getRandomDateWithinPastYear(): Date {
  const today = new Date();
  const pastYear = new Date(today.getFullYear() - 1, today.getMonth(), today.getDate());
  const randomTimestamp =
    pastYear.getTime() + Math.random() * (today.getTime() - pastYear.getTime());
  return new Date(randomTimestamp);
}

// Function to generate a shift date that is on or after the callout date
function getRelevantShiftDate(calloutDate: Date): Date {
  let daysDifference = 0; // Shift date within 0 to 7 days after callout
  while (daysDifference === 0) {
    daysDifference = Math.floor(Math.random() * 8);
  }
  const shiftDate = new Date(calloutDate);
  shiftDate.setDate(calloutDate.getDate() + daysDifference);
  return shiftDate;
}

// Function to generate a random time within reasonable working hours (8 AM to 6 PM)
function getRandomTime(date: Date): Date {
  const time = new Date(date);
  const year = time.getFullYear();
  const month = time.getMonth();
  const day = time.getDate();
  const hour = Math.floor(Math.random() * 10) + 8; // Hour between 8 AM and 6 PM
  const minute = Math.floor(Math.random() * 60);
  const seconds = Math.floor(Math.random() * 60);
  const milliseconds = Math.floor(Math.random() * 1000);

  return new Date(year, month, day, hour, minute, seconds, milliseconds);
}

// Function to seed callouts
const seedCallOuts = async (numOfSeeds?: number): Promise<void> => {
  console.log(logTemplate(`🌱 Seeding ${numOfSeeds} CallOuts...`));
  await sequelize.sync({ force: false });
  try {
    const leaveTypes: LeaveTypeAttributes[] = await getLeaveTypeFromDB.all();
    const supervisors: SupervisorWithAssociations[] =
      (await getSupervisorFromDB.all()) as SupervisorWithAssociations[];
    const employees: EmployeeWithAssociations[] =
      (await getEmployeeFromDB.all.nonSupervisors()) as EmployeeWithAssociations[];

    const iterations: number = numOfSeeds ?? numberOfCallouts;

    for (let i = 0; i < iterations; i++) {
      const employee: EmployeeWithAssociations =
        employees[Math.floor(Math.random() * employees.length)];
      const supervisor: SupervisorWithAssociations =
        supervisors[Math.floor(Math.random() * supervisors.length)];
      const leaveType: LeaveTypeAttributes =
        leaveTypes[Math.floor(Math.random() * leaveTypes.length)];
      const leaveTypeReason: DefaultLeaveTypes = leaveType.reason as DefaultLeaveTypes;
      const relevantComments: string[] = getRelevantComments(leaveTypeReason);
      const comment: string | undefined =
        relevantComments[Math.floor(Math.random() * relevantComments.length)];

      let calloutDate: Date = getRandomDateWithinPastYear();
      const calloutTime: Date = getRandomTime(calloutDate); // Callout time is the same as callout date

      calloutDate = calloutTime; // Callout date is the same as callout time

      let shiftDate: Date = getRelevantShiftDate(calloutDate);

      const shiftTime: Date = getRandomTime(shiftDate);

      shiftDate = shiftTime; // Shift date is the same as shift time

      let left_early_mins: number = 0;
      let arrived_late_mins: number = 0;

      if (
        leaveTypeReason === DefaultLeaveTypes.LATE_ARRIVAL ||
        leaveTypeReason === DefaultLeaveTypes.LEFT_EARLY
      ) {
        leaveTypeReason === DefaultLeaveTypes.LEFT_EARLY &&
          (left_early_mins = Math.floor(Math.random() * 60));
        leaveTypeReason === DefaultLeaveTypes.LATE_ARRIVAL &&
          (arrived_late_mins = Math.floor(Math.random() * 60));
      }

      const callout: CallOutCreationAttributes = {
        shift_time: shiftTime,
        shift_date: shiftDate,
        employee_id: employee.id,
        callout_date: calloutDate,
        callout_time: calloutTime,
        leave_type_id: leaveType.id,
        supervisor_id: supervisor.id,
        createdAt: calloutDate,
        updatedAt: calloutDate,
        supervisor_comments: comment ?? 'No comments',
        left_early_mins,
        arrived_late_mins
      };

      await CallOut.create(callout);
    }
    console.log(logTemplate(`✅ CallOuts seeded successfully!`));
  } catch (error) {
    console.error(logTemplate(`❌ Error seeding CallOuts: ${error}`, 'error'));
  }
};

if (require.main === module) {
  const number = process.argv[2] ? parseInt(process.argv[2], 10) : 20;
  seedCallOuts(number);
}

export default seedCallOuts;
