import { logTemplate } from '../../utils/server';
import { Division, DefaultDivisions } from '../models';

const defaultDivisions: DefaultDivisions[] = [
  DefaultDivisions.PUBLIC_PARKING,
  DefaultDivisions.EMPLOYEE_PARKING,
  DefaultDivisions.GROUND_TRANSPORTATION
];

export default async function seedDivisions() {
  try {
    await Division.bulkCreate(
      defaultDivisions.map(name => ({ name })),
      { ignoreDuplicates: true }
    );
    console.log(logTemplate('  ✅ Divisions seeds inserted successfully'));
  } catch (error) {
    const errMessage = '❌ Error seeding divisions:' + ' ' + error;
    console.error(logTemplate(errMessage, 'error'));
  }
}
