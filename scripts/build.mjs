import { join } from 'path';
import { existsSync, writeFileSync } from 'fs';
import { runCommand, findProjectPath } from './_helpers.mjs';


/**
 * Main function to build Dependability Tracker
 */
const main = () => {
    const projectPath = findProjectPath();

    // check for node_modules folder in the project
    // if it does not exist, run the install command
    if (!existsSync(join(projectPath, 'node_modules'))) {
        console.log('Installing dependencies...');
        runCommand('npm install');
    }

    // check for .next and dist folder in the project
    // if either does not exist, run the build command
    if (!existsSync(join(projectPath, '.next')) || !existsSync(join(projectPath, 'dist'))) {
        console.log('Building the project...');
        runCommand('next build');
        runCommand('tsc -p tsconfig.node.json');

        // look for a log file at the project root, if it does not exist, create it
        if (!existsSync(join(projectPath, 'log'))) {
            writeFileSync(join(projectPath, 'log'), '');
        }
    }

    // if the cert folder does not exist, run the script to generate the TLS certificates
    if (!existsSync(join(projectPath, 'cert'))) {
        console.log('Generating TLS certificates...');
        runCommand('npm run genTLS');
    }
};

main();