import winston, {format} from 'winston';
import WinstonDailyRotateFile from 'winston-daily-rotate-file';
import {getAbsolutePath} from 'src/utils/fs';

const {combine, timestamp, splat} = format;

const createLogger = (): winston.Logger => {
    const logFormat = format.printf((info) => {
        return `[${info.timestamp}] ${info.message}`;
    });

    const logPath = getAbsolutePath('./logs');
    return winston.createLogger({
        format: combine(
            splat(),
            timestamp(),
            logFormat
        ),
        transports: [
            new WinstonDailyRotateFile({
                datePattern: 'YYYY-MM-DD-HH',
                filename: `${logPath}/query-query.error.log`,
                level: 'error'
            }),
            new WinstonDailyRotateFile({
                datePattern: 'YYYY-MM-DD-HH',
                filename: `${logPath}/query-query.info.log`,
                level: 'info'
            })
        ]
    });
};

const formMessage = (resultCount: number, {text, values}: IQuery, errorMessage?: string) => {
    const data: any = {
        query: text.replace(/\s+/gmi, ' '),
        values: values.join(', '),
        resultCount
    };

    if (errorMessage) {
        data.error = errorMessage;
    }

    return JSON.stringify(data);
};

class QueryLogger {
    private _logger: winston.Logger;

    constructor() {
        this._logger = createLogger();
    }

    error(resultCount: number, query: IQuery, errorMessage: string): void {
        this._logger.error(formMessage(resultCount, query, errorMessage));
    }

    ok(resultCount: number, query: IQuery): void {
        this._logger.info(formMessage(resultCount, query));
    }
}

export default new QueryLogger();
