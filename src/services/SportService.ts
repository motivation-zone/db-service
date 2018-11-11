import {
    getSports as getSportsQuery,
    addUser as addUserQuery,
    getUsers as getUsersQuery
} from '../query-creators/sport-query-creators';
import {query, IResultError, IResultSuccess} from '../lib/db/client';
import {prepareResult, IGetLimit} from './base';

export default class SportService {
    static async getSports(): Promise<IResultError | IResultSuccess> {
        const result = await query({
            text: getSportsQuery(),
            values: []
        });

        return prepareResult(result);
    }

    static async getUsers(data: IGetLimit, id: number): Promise<IResultError | IResultSuccess> {
        const result = await query({
            text: getUsersQuery(data.order),
            values: [data.limit, data.skip, id]
        });

        return prepareResult(result);
    }

    static async addUser(userId: number, sportId: number): Promise<IResultError | IResultSuccess> {
        const result = await query({
            text: addUserQuery(),
            values: [userId, sportId]
        });

        return prepareResult(result);
    }
};
