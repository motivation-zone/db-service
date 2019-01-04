import * as winston from 'winston';
import {getAbsolutePath} from '../../utils/fs';

const {combine, timestamp, splat} = winston.format;

/**
 * File writing logger
 */
const createLogger = (): winston.Logger => {
    const logFormat = winston.format.printf((info) => {
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

class Logger {
    private _logger: winston.Logger;

    constructor() {
        this._logger = createLogger();
    }

    error(msg: string) {
        this._logger.error(msg);
    }

    info(msg: string) {
        this._logger.info(msg);
    }
}

export default new Logger();
