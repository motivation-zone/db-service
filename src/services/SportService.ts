import {
    getSports as getSportsQuery,
    addUser as addUserQuery
} from '../query-creators/sport-query-creators';
import {query, IResultError, IResultSuccess} from '../lib/db/client';
import {prepareResult} from './base';

export default class SportService {
    static async getSports(): Promise<IResultError | IResultSuccess> {
        const result = await query({
            text: getSportsQuery(),
            values: []
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
