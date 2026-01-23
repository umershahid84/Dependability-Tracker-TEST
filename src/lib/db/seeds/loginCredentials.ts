import 'dotenv/config';
import sequelize from '../connection';
import { logTemplate } from '../../utils/server';
import { LoginCredential } from '../models';
import { getSupervisorFromDB } from '../controller';
import { SupervisorWithAssociations } from '../models/Supervisor';

const loginCredentialSeeds = [
  {
    email: 'testadmin@xyz.org',
    password: 'Molajut5115!',
    supervisorName: 'Umer Shahid' // The first admin supervisor from supervisors seed
  }
];

const seedLoginCredentials = async () => {
  await sequelize.sync();
  try {
    // Get all supervisors to find the admin
    const supervisors = (await getSupervisorFromDB.all()) as SupervisorWithAssociations[];
    
    for (const credentialSeed of loginCredentialSeeds) {
      // Find the supervisor by name
      const supervisor = supervisors.find(
        s => s.supervisor_info?.name === credentialSeed.supervisorName
      );
      
      if (!supervisor) {
        console.error(
          logTemplate(`❌ Supervisor not found: ${credentialSeed.supervisorName}`, 'error')
        );
        continue;
      }

      // Check if credential already exists for this supervisor
      const existingCredential = await LoginCredential.findOne({
        where: { supervisor_id: supervisor.id }
      });

      if (existingCredential) {
        console.log(
          logTemplate(`  ⏭️  Login credential already exists for ${supervisor.supervisor_info?.name}`)
        );
        continue;
      }

      // Create the login credential
      await LoginCredential.create({
        email: credentialSeed.email,
        password: credentialSeed.password,
        supervisor_id: supervisor.id
      });
      
      console.log(
        logTemplate(`  ✅ Login credential created for ${supervisor.supervisor_info?.name} (${credentialSeed.email})`)
      );
    }

    console.log(logTemplate('  ✅ Login credentials seeded successfully!'));
  } catch (error) {
    const errMessage = '❌ Error seeding login credentials:' + ' ' + error;
    console.error(logTemplate(errMessage, 'error'));
  }
};

export default seedLoginCredentials;

if (require.main === module) {
  (async () => {
    await seedLoginCredentials();
  })();
}
