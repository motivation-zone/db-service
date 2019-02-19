import * as Boom from 'boom';

import {IGetLimit} from '../services/base';
import {OrderType} from '../query-creators/base';
import HttpErrors from './http/errors';
import HttpResponse from './http/response';

export const stringToBoolean = (value: string): boolean | undefined => {
    if (typeof value === 'undefined') {
        return;
    }

    return value === 'true' ? true : value === 'false' ? false : undefined;
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
        throw HttpResponse.error(Boom.badRequest, HttpErrors.MISSING_LIMIT_PARAMS);
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
