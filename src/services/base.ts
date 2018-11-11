import {IResultSuccess, IResultError} from '../lib/db/client';
import {translatePostgresqlNameToNode} from '../utils/db';
import {OrderType} from '../query-creators/base';

export interface IGetLimit {
    limit: number;
    skip: number;
    order: OrderType;
}

export const prepareResult = (result: IResultError | IResultSuccess) => {
    if (result.status === 'error') {
        return result;
    }

    result.data = result.data.map((el) => {
        return Object.keys(el).reduce((acc, curr) => {
            acc[translatePostgresqlNameToNode(curr)] = el[curr];
            return acc;
        }, {} as any);
    });
    return result;
};
