import 'dotenv/config';
import { Employee, Supervisor } from '../lib/db';
import { getCreateCredentialsInviteFromDB } from '../lib/db/controller';

if (require.main === module) {
    const [, , name] = process.argv;

    if (!name) {
        console.error('❌ Missing required argument: name');
        console.log('\nUsage: npm run getInviteToken -- "<Full Name>"');
        console.log('Example: npm run getInviteToken -- "Umer Shahid"');
        process.exit(1);
    }

    (async () => {
        try {
            console.log(`🔍 Searching for invite token for: ${name}`);
            
            const employee = await Employee.findOne({ where: { name } });
            
            if (!employee) {
                console.error(`❌ Employee not found: ${name}`);
                console.log('\nPlease check the spelling and ensure the employee exists in the database.');
                console.log('Note: The name must match exactly as stored in the database (case-sensitive).');
                process.exit(1);
            }
            
            const supervisor = await Supervisor.findOne({ where: { employee_id: employee.id } });
            
            if (!supervisor) {
                console.error(`❌ Supervisor record not found for employee: ${name}`);
                console.log('\nThis employee may not have supervisor privileges.');
                process.exit(1);
            }
            
            const existingInvite = await getCreateCredentialsInviteFromDB({ 
                supervisor_id: supervisor.id 
            });
            
            if (!existingInvite) {
                console.error(`❌ No credential invite found for: ${name}`);
                console.log('\nAn invite may need to be created first.');
                process.exit(1);
            }

            const inviteToken = existingInvite.invite_token;
            const inviteId = existingInvite.id;
            const expiresAt = existingInvite.expires_at;
            const email = existingInvite.email || 'Not set';

            console.log('\n✅ Invite token found!');
            console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
            console.log(`📧 Email: ${email}`);
            console.log(`🔑 Invite Token: ${inviteToken}`);
            console.log(`🆔 Invite ID: ${inviteId}`);
            console.log(`📅 Expires At: ${expiresAt?.toLocaleString() || 'Unknown'}`);
            console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
            
            // Check if token is expired
            if (expiresAt && new Date() > expiresAt) {
                console.log('⚠️  WARNING: This invite token has EXPIRED!');
                console.log('You may need to create a new invite.\n');
            }

            process.exit(0);
        } catch (error) {
            console.error('❌ Error retrieving invite token:', error);
            process.exit(1);
        }
    })();
}
