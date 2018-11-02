import * as express from 'express';

export enum ErrorCode {
    REQUIRED_FIELDS='REQUIRED_FIELDS',
    UNSUPPORTED_FIELD_VALUE='UNSUPPORTED_FIELD_VALUE',
    DB_LEVEL_ERROR='DB_LEVEL_ERROR'
}

interface IError {
    code: ErrorCode;
    message?: string;
}

interface ISuccess {
    data: any[];
}

export default class HttpResponse {

    static send(res: express.Response, status: number, data: ISuccess | IError) {
        res.status(status).json(data);
    }
}
