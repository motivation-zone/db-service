import winston, {format} from 'winston';
import {getAbsolutePath} from 'src/utils/fs';

const {combine, timestamp, splat} = format;

const createLogger = (): winston.Logger => {
    const logFormat = format.printf((info) => {
        return `${info.timestamp} [${info.level}] ${info.message}`;
    });

    const logPath = getAbsolutePath('./logs');
    return winston.createLogger({
        format: combine(
            splat(),
            timestamp(),
            logFormat
        ),
        transports: [
            new winston.transports.File({filename: `${logPath}/error.log`, level: 'error'}),
            new winston.transports.File({filename: `${logPath}/warn.log`, level: 'warn'}),
            new winston.transports.File({filename: `${logPath}/info.log`, level: 'info'})
        ]
    });
};

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

    warn(msg: string): void {
        this._logger.warn(msg);
    }

    ok(): void {}
}

export default new FileLogger();
