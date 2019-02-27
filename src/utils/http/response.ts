import {Response} from 'express';

export default class HttpResponse {
    static error(func: Function, text: string): void {
        throw func(text);
    }

    static ok(res: Response, data: any): void {
        res.json({data});
    }
}
