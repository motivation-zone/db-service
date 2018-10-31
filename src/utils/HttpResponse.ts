import * as express from 'express';

export default class HttpResponse {

    static send(res: express.Response, status: 'error' | 'ok', data: any) {
        const result = {status, data};
        res.json(result);
    }
}
