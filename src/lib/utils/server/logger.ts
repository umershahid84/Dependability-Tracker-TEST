export type LogType = 'info' | 'error' | 'warn' | 'debug';

export const LogTypeColorMap: Record<LogType, string> = {
    info: '\x1b[32m',
    error: '\x1b[31m',
    warn: '\x1b[33m',
    debug: '\x1b[34m'
};

export const logTemplate = (message: string, type: LogType = 'info'): string => {
    const date = new Date();
    const dateString = date.toISOString();
    return `[${dateString}] ${LogTypeColorMap[type]}[${type.toUpperCase()}]\x1b[0m ${message
        .replace(/\n/g, '')}`;
}


