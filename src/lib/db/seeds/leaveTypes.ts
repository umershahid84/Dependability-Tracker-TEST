import {LeaveType, DefaultLeaveTypes} from '../models';

const defaultLeaveTypes: DefaultLeaveTypes[] = [
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
