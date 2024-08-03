import { join } from 'path';
import { existsSync } from 'fs';
import { findProjectPath, runCommandAsRoot } from './_helpers.mjs';

// removes build artifacts from the project
const main = () => {
    const projectPath = findProjectPath();



    // check for .next and dist folder in the project and remove them
    if (existsSync(join(projectPath, '.next'))) {
        console.log('Removing .next folder...');
        runCommandAsRoot('rm -rf .next');
    }

    if (existsSync(join(projectPath, 'dist'))) {
        console.log('Removing dist folder...');
        runCommandAsRoot('rm -rf dist');
    }

};

main();