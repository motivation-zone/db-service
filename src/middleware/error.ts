import * as Boom from 'boom';
import {Request, Response, NextFunction} from 'express';

import logger from '../lib/logger';
import DBError from '../utils/db/db-error';

export default (err: any, _req: Request, res: Response, _next: NextFunction): void => {
    if (err.isBoom) {
        sendError(res, err);
    } else if (err instanceof DBError) {
        sendError(res, Boom.conflict(err.message));
    } else {
        logger('error', 'app', JSON.stringify({err: {stack: err.stack, message: err.message}}));
        sendError(res, Boom.internal());
    }
};

function sendError(res: Response, err: Boom): void {
    res.status(err.output.statusCode).json({err: err.output.payload});
}