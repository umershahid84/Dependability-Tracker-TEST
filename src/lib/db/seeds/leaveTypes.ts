import { LeaveType } from '../models';
import { defaultLeaveTypes, logTemplate } from '../../utils/server';

export default async function seedLeaveTypes() {
  try {
    await LeaveType.bulkCreate(
      defaultLeaveTypes.map(reason => ({ reason })),
      { ignoreDuplicates: true }
    );
    console.log(logTemplate('  ✅ Leave types seeds inserted successfully'));
  } catch (error) {
    const errMessage = '❌ Error seeding leave types:' + ' ' + error;
    console.error(logTemplate(errMessage, 'error'));
  }
}
