import winston, {format} from 'winston';
import WinstonDailyRotateFile from 'winston-daily-rotate-file';
import {getAbsolutePath} from 'src/utils/fs';

const {combine, timestamp, splat} = format;

const createLogger = (): winston.Logger => {
    const levels = {
        error: 0,
        warn: 1,
        info: 2,
        verbose: 3,
        debug: 4,
        silly: 5
    };
    const logFormat = format.printf((info) => {
        return `[${info.timestamp}] ${info.message}`;
    });

    const logPath = getAbsolutePath('./logs');
    return winston.createLogger({
        levels,
        format: combine(
            splat(),
            timestamp(),
            logFormat
        ),
        transports: [
            new WinstonDailyRotateFile({
                datePattern: 'YYYY-MM-DD-HH',
                filename: `${logPath}/error.log`,
                level: 'error'
            }),
            new WinstonDailyRotateFile({
                datePattern: 'YYYY-MM-DD-HH',
                filename: `${logPath}/info.log`,
                level: 'info'
            }),
            new WinstonDailyRotateFile({
                datePattern: 'YYYY-MM-DD-HH',
                filename: `${logPath}/warn.log`,
                level: 'warn'
            })
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
