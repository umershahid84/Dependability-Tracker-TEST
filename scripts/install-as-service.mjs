import { join, dirname } from 'path';
import { existsSync, mkdirSync, writeFileSync } from 'fs';
import { runCommand, runCommandAsRoot, runCommandAsRootCapture, findNodePath, findProjectPath } from './_helpers.mjs';


/**
 * Generates a start.sh script in the project's scripts directory
 * 
 * The start.sh script changes to the project directory and runs the npm start command.
 * The script can be used by systemd to start the service.
 * @param {string} projectPath the path to the project
 */
const createStartScript = (projectPath) => {
    const startScriptPath = join(projectPath, 'scripts', 'start.sh');
    const logFilePath = join(projectPath, 'log');
    const startScriptContent = `#!/bin/bash

# Change to the directory where dependability's package.json is located
cd ${projectPath}

# Run the start command, appending its output to the log file
npm start >> ${logFilePath}
`;

    // Ensure the directory for start.sh exists
    const startScriptDir = dirname(startScriptPath);
    if (!existsSync(startScriptDir)) {
        mkdirSync(startScriptDir, { recursive: true });
    }

    writeFileSync(startScriptPath, startScriptContent, { mode: 0o755 });
};

/**
 * Generates a SELinux policy file in /tmp/dependability_service.te
 */
const createSelinuxPolicy = () => {
    const policyFilePath = '/tmp/dependability_service.te';
    const selinuxPolicyContent = `module dependability_service 1.0;

require {
    type user_home_t;
    type init_t;
    class file { read execute };
    class process { transition };
}

# Allow systemd to execute the script
allow init_t user_home_t:file { read execute };
allow init_t self:process transition;
`;

    runCommandAsRoot(`echo "${selinuxPolicyContent}" | sudo tee ${policyFilePath} > /dev/null`);
};

// Generates a systemd service file in /etc/systemd/system/dependability.service
const createServiceFile = (nodePath, projectPath) => {
    const serviceFilePath = '/etc/systemd/system/dependability.service';
    const serviceFileContent = `[Unit]
Description=Dependability Tracker Service

[Service]
ExecStart=${join(projectPath, 'scripts', 'start.sh')}
WorkingDirectory=${projectPath}
Environment="PATH=${dirname(nodePath)}:/usr/local/bin:/usr/bin:/bin"
Restart=on-failure
RestartSec=10

[Install]
WantedBy=multi-user.target
`;

    runCommandAsRoot(`echo "${serviceFileContent}" | sudo tee ${serviceFilePath} > /dev/null`);
};



/**
 * Main function to install Dependability Tracker as a service
 */
const main = () => {
    const nodePath = findNodePath();
    const projectPath = findProjectPath();

    // run the build script to ensure the project is ready
    runCommand('node scripts/build.mjs');

    // Create necessary files+
    console.log('Creating start.sh script...');
    createStartScript(projectPath);

    console.log('Creating SELinux policy file...');
    createSelinuxPolicy();

    console.log('Creating systemd service file...');
    createServiceFile(nodePath, projectPath);

    console.log('Installing SELinux Policies...');
    // Install SELinux policies
    runCommandAsRoot('dnf install -y policycoreutils policycoreutils-python-utils');
    runCommandAsRoot('checkmodule -M -m -o /tmp/dependability_service.mod /tmp/dependability_service.te');
    runCommandAsRoot('semodule_package -o /tmp/dependability_service.pp -m /tmp/dependability_service.mod');
    runCommandAsRoot('semodule -i /tmp/dependability_service.pp');
    // Apply SELinux context and manage service
    runCommandAsRoot(`semanage fcontext -a -t bin_t "${projectPath}(/.*)?"`);
    runCommandAsRoot(`restorecon -R ${projectPath}`);

    console.log('Reloading daemons and attaching dependability.service')
    runCommandAsRoot('systemctl daemon-reload');
    runCommandAsRoot('systemctl enable dependability.service');
    runCommandAsRoot('systemctl start dependability.service');

    // Output service status
    const status = runCommandAsRootCapture('systemctl status dependability.service');
    console.log(status);
};

main();
