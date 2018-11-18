import {
    getSports as getSportsQuery,
    addUser as addUserQuery,
    getUsers as getUsersQuery
} from '../query-creators/sport';
import {query} from '../lib/db/client';
import {prepareDBResult, IGetLimit} from './base';

export default class SportService {
    static async getSports() {
        const result = await query({
            text: getSportsQuery(),
            values: []
        });

        return prepareDBResult(result);
    }

    static async getUsers(data: IGetLimit, id: number) {
        const result = await query({
            text: getUsersQuery(data.order),
            values: [data.limit, data.skip, id]
        });

        return prepareDBResult(result);
    }

    static async addUser(userId: number, sportId: number) {
        const result = await query({
            text: addUserQuery(),
            values: [userId, sportId]
        });

        return prepareDBResult(result);
    }
};
