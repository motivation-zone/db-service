import qs from 'querystring';
import Boom from 'boom';
import Joi from 'joi';
import {Request, Response, NextFunction} from 'express';

import {IGetLimit} from 'src/services/base';
import {ORDER_TYPES, OrderType} from 'src/query-creators/base';
import HttpResponse from 'src/utils/http/response';

export const parseDate = (date: Date | string | undefined): Date | undefined => {
    if (!date) {
        return;
    }

    if (date instanceof Date) {
        return date;
    }

    if (typeof date === 'string') {
        return new Date(Date.parse(date));
    }
};

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
    Promise.resolve(fn(req, res, next)).catch(next);
};

export const intervalRandom = (min: number, max: number): number => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

/**
 * Check that all fields has a value in object
 */
export const checkRequiredFields = (fields: string[], obj: any): boolean => {
    return fields.every((field) => {
        if (typeof obj[field] === 'boolean') {
            return true;
        }

        return Boolean(obj[field]);
    });
};

/**
 * Checker for get request limit params {limit, skip, order}
 */
export const checkGetLimitParameters = async (data: any): Promise<IGetLimit> => {
    const {limit, skip, order} = data;
    const validateData = {limit, skip, order: order || OrderType.ASC};
    const schema = {
        limit: Joi.number().required(),
        skip: Joi.number().required(),
        order: Joi.string().valid(ORDER_TYPES).required()
    };

    try {
        await Joi.validate(validateData, schema);
    } catch (e) {
        HttpResponse.throwError(Boom.badRequest, joiValidationErrorToString(e));
    }

    return validateData;
};

/**
 * Remove all fields that includes in not updated fields
 */
export const removeNotUpdatedFields = (fields: string[], notUpdateFields: string[] = []): string[] => {
    return fields.filter((field) => {
        return !notUpdateFields.includes(field);
    });
};

/**
 * Return all fields of objects which not empty (has a value)
 * 'function' removes too (it's neccessary to get only fields without methods)
 */
export const getNotEmptyFields = (obj: any): string[] => {
    const types = ['boolean', 'number'];
    return Object.keys(obj).filter((field) => {
        if (types.includes(typeof obj[field])) {
            return true;
        }

        if (typeof obj[field] === 'function') {
            return false;
        }

        return Boolean(obj[field]);
    });
};

/**
 * Create array of objects {name, value} from to arrays
 */
export const createMapData = (nameFields: string[], valueFields: any[]) => {
    return nameFields.map((name, i) => {
        return {
            name,
            value: valueFields[i]
        };
    }).filter((el) => el.value);
};

export const formQueryString = (data: any): string => {
    const query = getNotEmptyFields(data).reduce((result: any, field: string) => {
        result[field] = data[field];
        return result;
    }, {});
    return qs.stringify(query);
};

export const joiValidationErrorToString = (error: Joi.ValidationError): string => {
    return error.details.map((d: any) => d.message).join(', ');
};
