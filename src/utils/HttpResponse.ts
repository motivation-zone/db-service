import * as express from 'express';

export default class HttpResponse {
    static 409(res: express.Response, message: string) {
        res.status(409).json({message});
    }

    static 400(res: express.Response) {
        res.status(400).json({});
    }

    static 200(res: express.Response, data: any) {
        res.status(200).json({data});
    }

    static 201(res: express.Response, data: any) {
        res.status(201).json({data});
    }
}
