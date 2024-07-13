import {getSupervisorFromDB, createCreateCredentialsInviteInDB} from '../controller';
import { SupervisorWithAssociations } from '../models/Supervisor';

const seedCredentialInvites = async () => {
  // find the admins

  try {
    const admins = await getSupervisorFromDB.admins() as SupervisorWithAssociations[] ;
    const supervisors = await getSupervisorFromDB.all() as SupervisorWithAssociations[];

    // create login invites for each admin so they can create their own login credentials
    for (const supervisor of supervisors) {
      await createCreateCredentialsInviteInDB({
        supervisor_id: supervisor.id,
        created_by: admins[0].id
      });
    }
  } catch (error) {
    console.error('❌ Error seeding credential invites:', error);
  }
};

export default seedCredentialInvites;

if (require.main === module) {
  console.log('🌱 Seeding credential invites...');
  seedCredentialInvites();
}
