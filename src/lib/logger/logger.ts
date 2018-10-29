import consoleLogger, {LevelType} from './console-logger';
import fileLogger from './file-logger';
import env from '../env';

type LoggerType = 'app' | 'db';

const formMessage = (type: LoggerType, msg: string) => {
    return `[${type}]: ${msg}`;
}

export default (level: LevelType, type: LoggerType, msg: string) => {
    const msgResult = formMessage(type, msg);

    if (env === 'development') {
        consoleLogger[level](msgResult);
    } else {
        fileLogger[level](msgResult);
    }
};
