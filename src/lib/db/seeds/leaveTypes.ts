import {LeaveType} from '../models';
import {defaultLeaveTypes} from '../../utils/server';

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
