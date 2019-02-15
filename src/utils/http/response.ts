import {Response} from 'express';

export default class HttpResponse {
    static error(func: Function, text: string) {
        throw func(text);
    }

    static ok(res: Response, data: any) {
        res.json({data});
    }
}
