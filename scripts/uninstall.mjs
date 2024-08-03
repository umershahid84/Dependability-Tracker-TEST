import { join } from 'path';
import { existsSync } from 'fs';
import { runCommand, runCommandAsRoot, findProjectPath, runCommandAsRootCapture } from './_helpers.mjs';

// Main function to uninstall Dependability Tracker
// removes the build artifacts, the start.sh script, the service, SELinux policies, the log file, and the cert folder
const main = () => {
    const projectPath = findProjectPath();

    // run the clean script to remove build artifacts
    console.log('Cleaning the project...');
    runCommand('node ./scripts/clean.mjs');

    // check for node_modules folder in the project and remove it
    if (existsSync(join(projectPath, 'node_modules'))) {
        console.log('Removing node_modules folder...');
        runCommandAsRoot('rm -rf node_modules', false, false);
    }

    // remove start.sh script
    // remove the start.sh script from the scripts directory
    const startScriptPath = join(projectPath, 'scripts', 'start.sh');
    if (existsSync(startScriptPath)) {
        console.log('Removing start.sh script...');
        runCommandAsRoot(`rm ${startScriptPath}`, false, false);
    }

    // uninstall the service
    console.log('Uninstalling Dependability Tracker service...');
    runCommandAsRoot('sudo systemctl stop dependability', false, false);
    runCommandAsRoot('sudo systemctl disable dependability', false, false);
    runCommandAsRoot('sudo rm /etc/systemd/system/dependability.service', false, false);
    runCommandAsRoot('sudo systemctl daemon-reload');

    // check if SELinux is enabled
    const selinuxStatus = runCommandAsRootCapture('sestatus', false, false);

    if (selinuxStatus?.includes('enabled')) {
        // remove SELinux policies
        console.log('Removing SELinux policies...');
        runCommandAsRoot('semodule -r dependability_service');
        runCommandAsRoot(`semanage fcontext -d "${projectPath}(/.*)?"`);
        runCommandAsRoot(`restorecon -R ${projectPath}`);
    }

    // remove the log file
    console.log('Removing log file...');
    runCommand(`rm ${join(projectPath, 'log')}`, false, false);

    // remove the cert folder
    console.log('Removing cert folder...');
    runCommand(`rm -rf ${join(projectPath, 'cert')}`, false, false);

    console.log('Dependability Tracker has been uninstalled successfully.');

};

main();