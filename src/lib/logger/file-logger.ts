import winston, {format} from 'winston';
import {getAbsolutePath} from 'src/utils/fs';

const {combine, timestamp, splat} = format;

/**
 * File writing logger
 */
const createLogger = (): winston.Logger => {
    const logFormat = format.printf((info) => {
        return `${info.timestamp} [${info.level}] ${info.message}`;
    });

    const logPath = getAbsolutePath('./logs');
    const name = 'dbservice';
    return winston.createLogger({
        format: combine(
            splat(),
            timestamp(),
            logFormat
        ),
        transports: [
            new winston.transports.File({filename: `${logPath}/${name}.error.log`, level: 'error'}),
            new winston.transports.File({filename: `${logPath}/${name}.log`, level: 'info'})
        ]
    });
};

export interface ILogger {
    error: (msg: string) => void;
    info: (msg: string) => void;
}

class FileLogger implements ILogger {
    private _logger: winston.Logger;

    constructor() {
        this._logger = createLogger();
    }

    error(msg: string): void {
        this._logger.error(msg);
    }

    info(msg: string): void {
        this._logger.info(msg);
    }
}

export default new FileLogger();
