import {
    runCommand,
    findNodePath,
    findProjectPath,
    runCommandAsRoot,
    createStartScript,
    createServiceFile,
    createSelinuxPolicyFile,
    runCommandAsRootCapture,
} from './_helpers.mjs';

/**
 * Main function to install Dependability Tracker as a service
 */
const main = () => {
    const nodePath = findNodePath();
    const projectPath = findProjectPath();

    // run the build script to ensure the project is ready
    runCommand('node scripts/build.mjs');

    // Create the start.sh script and the service file
    createStartScript(projectPath);
    createServiceFile(nodePath, projectPath);

    // check if SELinux is enabled
    const selinuxStatus = runCommandAsRootCapture('sestatus', false, false);
    if (selinuxStatus?.includes('enabled')) {

        // Create the SELinux policy file
        createSelinuxPolicyFile();
        console.log('Installing SELinux Policies...');
        // Check if the required packages are installed
        runCommandAsRoot('dnf install -y policycoreutils policycoreutils-python-utils');
        // Compile the policy
        runCommandAsRoot('checkmodule -M -m -o /tmp/dependability_service.mod /tmp/dependability_service.te');
        // Package the policy
        runCommandAsRoot('semodule_package -o /tmp/dependability_service.pp -m /tmp/dependability_service.mod');
        // Install the policy
        runCommandAsRoot('semodule -i /tmp/dependability_service.pp');
        // Apply SELinux context to the project directory
        runCommandAsRoot(`semanage fcontext -a -t bin_t "${projectPath}(/.*)?"`);
        // Ensures the policy context is applied to all files recursively
        runCommandAsRoot(`restorecon -R ${projectPath}`);
    }
    console.log('Reloading daemons and attaching dependability.service');
    runCommandAsRoot('systemctl daemon-reload');
    runCommandAsRoot('systemctl enable dependability.service');
    runCommandAsRoot('systemctl start dependability.service');

    // Output service status
    const status = runCommandAsRootCapture('systemctl status dependability.service');
    console.log(status);
};

main();
