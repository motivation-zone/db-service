import consoleLogger, {LevelType, IDebugTarget} from 'src/lib/logger/console-logger';
import fileLogger, {ILogger} from 'src/lib/logger/file-logger';
import env from 'src/lib/env';

type LoggerType = 'app' | 'db';

const formMessage = (type: LoggerType, msg: string) => {
    return `[${type}]: ${msg}`;
};

export default (level: LevelType, type: LoggerType, msg: string) => {
    const msgResult = formMessage(type, msg);

    const f = env === 'development' ? consoleLogger : fileLogger;
    (f as ILogger | IDebugTarget)[level](msgResult);
};
