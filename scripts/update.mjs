import { existsSync } from 'fs';
import { runCommand, runCommandAsRoot, runCommandAsRootCapture, runCommandCapture } from './_helpers.mjs';

const osType = runCommandCapture('uname -s', false, false);
const isLinux = osType.includes('Linux');
const serviceFileExists = existsSync('/etc/systemd/system/dependability.service');

/**
 * Main function to Update Dependability Tracker
 */
const main = () => {
    // do a git pull origin main to get the latest changes
    console.log('Updating the project...');
    const updateData = runCommandCapture('git pull origin main');
    // parse the output of the git pull command to see if changes were made
    if (updateData.includes('Already up to date.')) {
        console.log('\nDependability Tracker is already up to date.');
        return;
    }
    console.log('\nUpdates found. Rebuilding the project...');
    // run the clean script to remove the build files
    runCommand('node scripts/clean.mjs');
    // run the build script to ensure the project is ready
    runCommand('node scripts/build.mjs');
    console.log('Project rebuilt successfully.');

    // check for a dependability.service file in /etc/systemd/system
    if (isLinux && !serviceFileExists) {
        console.log('Installing Dependability Tracker as a service...');
        runCommand('node scripts/install-as-service.mjs');
    } else if (isLinux && serviceFileExists) {
        // if the service file exists, restart the service
        console.log('Restarting Dependability Tracker service...');
        runCommandAsRoot('sudo systemctl daemon-reload');
        runCommandAsRoot('sudo systemctl restart dependability');
        console.log('Dependability Tracker service restarted successfully.');
        const status = runCommandAsRootCapture('sudo systemctl status dependability');
        console.log(status)
    } else {
        console.log('Dependability Tracker is not running on a Linux system. Skipping service update.');
    }
};

main();
