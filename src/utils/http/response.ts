import {Response} from 'express';
import Boom from 'boom';

export interface IResponse<T> {
    status: number;
    data: T;
    error: Boom.Payload;
}

export const formResponse = <T>(response: any, Class: {new(data: any): T}): IResponse<T[]> => {
    const {error, data} = response.body;

    return {
        status: response.status,
        data: data && data.map((x: any) => new Class(x)),
        error
    };
};

export default class HttpResponse {
    static throwError(func: Function, text: string): never {
        throw func(text);
    }

    static ok(res: Response, data: any): void {
        res.json({data});
    }

    static error(res: Response, status: number, error: any): void {
        res.status(status).json({error});
    }
}
