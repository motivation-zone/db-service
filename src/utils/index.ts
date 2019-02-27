import Boom from 'boom';
import {Request, Response, NextFunction} from 'express';

import {IGetLimit} from 'src/services/base';
import {OrderType} from 'src/query-creators/base';
import HttpErrors from 'src/utils/http/errors';
import HttpResponse from 'src/utils/http/response';

/**
 * It's neccessary for parsing boolean keys from query
 */
export const queryStringToBoolean = (value: string): boolean | undefined => {
    if (typeof value === 'undefined') {
        return;
    }

    return value === 'true' ? true : value === 'false' ? false : undefined;
};

/**
 * Special wrapper for async middlewares
 */
export const asyncMiddlewareWrapper = (fn: Function) => (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch((err) => {
        if (!err.isBoom) {
            return next(Boom.badImplementation(err));
        }
        next(err);
    });
};

export const intervalRandom = (min: number, max: number): number => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

export const checkRequiredFields = (fields: string[], obj: any): boolean => {
    return fields.every((field) => {
        if (typeof obj[field] === 'boolean') {
            return true;
        }

        return Boolean(obj[field]);
    });
};

export const checkGetLimitParameters = (data: any): IGetLimit => {
    const {limit, skip, order} = data;
    if (!limit || !skip || order && ![OrderType.DESC, OrderType.ASC].includes(order.toUpperCase())) {
        HttpResponse.error(Boom.badRequest, HttpErrors.MISSING_LIMIT_PARAMS);
    }

    return {limit, skip, order};
};

export const getNotEmptyFields = (obj: any, notUpdateFields: string[] = []) => {
    return Object.keys(obj).filter((field) => {
        return !notUpdateFields.includes(field);
    }).filter((field) => {
        if (typeof obj[field] === 'boolean') {
            return true;
        }

        return Boolean(obj[field]);
    });
};

export const filterMapData = (nameFields: string[], valueFields: any[]) => {
    return nameFields.map((name, i) => {
        return {
            name,
            value: valueFields[i]
        };
    }).filter((el) => el.value);
};
