import {translatePostgresqlNameToNode} from 'src/utils/db/helper';
import {OrderType} from 'src/query-creators/base';

export interface IGetLimit {
    limit: number;
    skip: number;
    order: OrderType;
}

export const prepareDBResult = (result: any[]): any[] => {
    return result.map((el) => {
        return Object.keys(el).reduce((acc, curr) => {
            acc[translatePostgresqlNameToNode(curr)] = el[curr];
            return acc;
        }, {} as any);
    });
};
