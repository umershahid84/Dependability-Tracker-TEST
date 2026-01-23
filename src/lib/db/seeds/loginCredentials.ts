import 'dotenv/config';
import sequelize from '../connection';
import { logTemplate } from '../../utils/server';
import { LoginCredential } from '../models';
import { getSupervisorFromDB } from '../controller';
import { SupervisorWithAssociations } from '../models/Supervisor';

// WARNING: These credentials are for development/testing only
// In production, credentials should be created through the invitation system
// or provided via secure configuration management
const loginCredentialSeeds = [
  {
    email: 'testadmin@xyz.org',
    password: 'Molajut5115!'
  }
];

const seedLoginCredentials = async () => {
  await sequelize.sync();
  try {
    // Get the first admin supervisor
    const admins = (await getSupervisorFromDB.admins()) as SupervisorWithAssociations[];
    
    if (!admins || admins.length === 0) {
      console.error(logTemplate('❌ No admin supervisors found', 'error'));
      return;
    }

    const adminSupervisor = admins[0];
    
    for (const credentialSeed of loginCredentialSeeds) {
      // Check if credential already exists for this supervisor
      const existingCredential = await LoginCredential.findOne({
        where: { supervisor_id: adminSupervisor.id }
      });

      if (existingCredential) {
        console.log(
          logTemplate(`  ⏭️  Login credential already exists for ${adminSupervisor.supervisor_info?.name}`)
        );
        continue;
      }

      // Create the login credential
      await LoginCredential.create({
        email: credentialSeed.email,
        password: credentialSeed.password,
        supervisor_id: adminSupervisor.id
      });
      
      console.log(
        logTemplate(`  ✅ Login credential created for ${adminSupervisor.supervisor_info?.name} (${credentialSeed.email})`)
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
