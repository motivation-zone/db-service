import {notFound} from 'boom';
import {Request, Response, NextFunction} from 'express';

export default (_req: Request, _res: Response, next: NextFunction): void => {
    next(notFound('Not Found'));
};
