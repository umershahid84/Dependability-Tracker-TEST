import {LeaveType, DefaultLeaveTypes} from '../models';

const defaultLeaveTypes: DefaultLeaveTypes[] = [
  DefaultLeaveTypes.FCA,
  DefaultLeaveTypes.PTO,
  DefaultLeaveTypes.FMLA,
  DefaultLeaveTypes.SICK,
  DefaultLeaveTypes.LWOP,
  DefaultLeaveTypes.PHEL,
  DefaultLeaveTypes.HOLIDAY,
  DefaultLeaveTypes.VACATION,
  DefaultLeaveTypes.JURY_DUTY,
  DefaultLeaveTypes.MATERNITY,
  DefaultLeaveTypes.PATERNITY,
  DefaultLeaveTypes.LEFT_EARLY,
  DefaultLeaveTypes.BEREAVEMENT,
  DefaultLeaveTypes.LATE_ARRIVAL,
  DefaultLeaveTypes.NO_CALL_NO_SHOW,
  DefaultLeaveTypes.PERSONAL_HOLIDAY,
  DefaultLeaveTypes.HOLIDAY_OPTIONAL
];

export default async function seedLeaveTypes() {
  try {
    await LeaveType.bulkCreate(
      defaultLeaveTypes.map(reason => ({reason})),
      {ignoreDuplicates: true}
    );
    console.log('✅ Leave types seeded');
  } catch (error) {
    console.error('❌ Error seeding leave types:', error);
  }
}
