import {translatePostgresqlNameToNode} from 'src/utils/db/helper';
import {OrderType} from 'src/query-creators/base';

/**
 * @apiDoc
 * @type model
 * @name LimitQueryParams
 * @object [[{
 *  "name": "limit",
 *  "type": "number"
 * }, {
 *  "name": "skip",
 *  "type": "number"
 * }, {
 *  "name": "order",
 *  "type": "ASC | DESC",
 *  "default": "ASC"
 * }]]
 */
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
