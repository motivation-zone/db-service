import consoleLogger from 'src/lib/logger/console-logger';
import fileLogger from 'src/lib/logger/file-logger';
import env from 'src/lib/env';

const formMessage = (type: LoggerType, msg: string) => {
    return `[${type}]: ${msg}`;
};

export default (level: keyof ILogger, type: LoggerType, msg: string) => {
    const msgResult = formMessage(type, msg);

    const f = env === 'production' ? fileLogger : consoleLogger;
    (f as any)[level](msgResult);
};
