import {Division, DefaultDivisions} from '../models';

const defaultDivisions: DefaultDivisions[] = [
  DefaultDivisions.PUBLIC_PARKING,
  DefaultDivisions.EMPLOYEE_PARKING,
  DefaultDivisions.GROUND_TRANSPORTATION
];

export default async function seedDivisions() {
  try {
    await Division.bulkCreate(
      defaultDivisions.map(name => ({name})),
      {ignoreDuplicates: true}
    );
    console.log('  ✅ Divisions seeds inserted successfully');
  } catch (error) {
    console.error('❌ Error seeding divisions:', error);
  }
}
