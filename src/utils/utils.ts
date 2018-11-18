import {IGetLimit} from '../services/base';
import {OrderType} from '../query-creators/base';

export const stringToBoolean = (value: string): boolean | undefined => {
    if (typeof value === 'undefined') {
        return;
    }

    return value === 'true' ? true : value === 'false' ? false : undefined;
};

export const checkNecessaryFields = (fields: any[], obj: any): boolean => {
    return fields.every((field) => {
        return Boolean(obj[field]);
    });
}

export const checkGetLimitParameters = (data: any): IGetLimit | undefined => {
    const {limit, skip, order} = data;
    const orderTypes: OrderType[] = ['DESC', 'ASC'];

    if (!limit || !skip || order && !orderTypes.includes(order.toUpperCase())) {
        return;
    }

    return {limit, skip, order};
}

export const getNotEmptyFields = (obj: any, notUpdateFields: any[]) => {
    return Object.keys(obj).filter((field) => {
        return !notUpdateFields.includes(field);
    }).filter((field) => {
        if (typeof obj[field] === 'boolean') {
            return true;
        }

        return Boolean(obj[field]);
    });
};
