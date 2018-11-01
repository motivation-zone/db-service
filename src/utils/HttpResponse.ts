import * as express from 'express';

export default class HttpResponse {

    static send(res: express.Response, status: number, data: any = {}) {
        res.status(status).json(data);
    }
}
