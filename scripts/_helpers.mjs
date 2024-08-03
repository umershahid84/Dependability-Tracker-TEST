import { execSync } from 'child_process';

export const runCommand = (command) => {
    try {
        execSync(command, { stdio: 'inherit' });
    } catch (error) {
        console.error(`Command failed: ${command}`, error);
        process.exit(1);
    }
};

export const runCommandCapture = (command) => {
    try {
        return execSync(command).toString().trim();
    } catch (error) {
        console.error(`Command failed: ${command}`, error);
        process.exit(1);
    }
}

// Utility function to run commands with elevated privileges
export const runCommandAsRoot = (command) => {
    try {
        execSync(`sudo ${command}`, { stdio: 'inherit' });
    } catch (error) {
        console.error(`Command failed: ${command}`, error);
        process.exit(1);
    }
};

// Utility function to run a command and capture output
export const runCommandAsRootCapture = (command) => {
    try {
        return execSync(command).toString().trim();
    } catch (error) {
        console.error(`Command failed: ${command}`, error);
        process.exit(1);
    }
};

// Find Node.js executable path
export const findNodePath = () => {
    const nodePath = runCommandAsRootCapture('which node');
    if (!nodePath) throw new Error('Node.js executable not found.');
    return nodePath;
};

// Find the project directory dynamically
export const findProjectPath = () => {
    return runCommandAsRootCapture('pwd');
};
