import { dirname, join } from 'path';
import { execSync } from 'child_process';
import { existsSync, mkdirSync, writeFileSync } from 'fs';

export const runCommand = (command, exitOnFailure = true, logError = true) => {
    try {
        execSync(command, { stdio: 'inherit' });
    } catch (error) {
        logError && console.error(`Command failed: ${command}`, error);
        exitOnFailure && process.exit(1);
        return 'Command failed';
    }
};

export const runCommandCapture = (command, exitOnFailure = true, logError = true) => {
    try {
        return execSync(command).toString().trim();
    } catch (error) {
        logError && console.error(`Command failed: ${command}`, error);
        exitOnFailure && process.exit(1);
        return 'Command failed';
    }
}

// Utility function to run commands with elevated privileges
export const runCommandAsRoot = (command, exitOnFailure = true, logError = true) => {
    try {
        execSync(`sudo ${command}`, { stdio: 'inherit' });
    } catch (error) {
        logError && console.error(`Command failed: ${command}`, error);
        exitOnFailure && process.exit(1);
        return 'Command failed';
    }
};

// Utility function to run a command and capture output
export const runCommandAsRootCapture = (command, exitOnFailure = true, logError = true) => {
    try {
        return execSync(command).toString().trim();
    } catch (error) {
        logError && console.error(`Command failed: ${command}`, error);
        exitOnFailure && process.exit(1);
        return 'Command failed';
    }
};

// Find Node.js executable path
export const findNodePath = () => {
    const nodePath = runCommandAsRootCapture('which node');
    if (!nodePath) throw new Error('Node.js executable not found.');
    return nodePath;
};

// Find the project directory dynamically
export const findProjectPath = () => process.cwd();


/**
 * Generates a start.sh script in the project's scripts directory
 * 
 * The start.sh script changes to the project directory and runs the npm start command.
 * The script can be used by systemd to start the service.
 * @param {string} projectPath the path to the project
 */
export const createStartScript = projectPath => {
    const startScriptPath = join(projectPath, 'scripts', 'start.sh');
    const logFilePath = join(projectPath, 'log');
    const startScriptContent = `#!/bin/bash

# Change to the directory where dependability's package.json is located
cd ${projectPath}

# Run the start command, appending its output to the log file
npm start >> ${logFilePath}
`;
    console.log('Creating start.sh script...');
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
export const createSelinuxPolicyFile = () => {

    const policyFilePath = '/tmp/dependability_service.te';
    const selinuxPolicyFileContent = `module dependability_service 1.0;

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
    console.log('Creating SELinux policy file...');
    runCommandAsRoot(`echo "${selinuxPolicyFileContent}" | sudo tee ${policyFilePath} > /dev/null`);
};

// Generates a systemd service file in /etc/systemd/system/dependability.service
export const createServiceFile = (nodePath, projectPath) => {
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
    console.log('Creating systemd service file...');
    runCommandAsRoot(`echo "${serviceFileContent}" | sudo tee ${serviceFilePath} > /dev/null`);
};

