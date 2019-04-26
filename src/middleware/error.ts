import Boom from 'boom';
import {Request, Response, NextFunction} from 'express';

import logger from 'src/lib/logger';
import HttpResponse from 'src/utils/http/response';

export default (err: any, _req: Request, res: Response, _next: NextFunction): void => {
    logger('error', 'app', JSON.stringify(err));
    if (err.isBoom) {
        sendError(res, err);
    } else {
        sendError(res, Boom.internal());
    }
};

function sendError(res: Response, err: Boom): void {
    HttpResponse.error(res, err.output.statusCode, err.output.payload);
}
