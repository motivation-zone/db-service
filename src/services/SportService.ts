import {
    getSports as getSportsQuery,
    addUser as addUserQuery,
    deleteUser as deleteUserQuery,
    getUsers as getUsersQuery
} from '../query-creators/sport';
import {query} from '../lib/db/client';
import {prepareDBResult, IGetLimit} from './base';

type SportUserActionTypes = 'delete' | 'add';
export const SPORT_USER_ACTION_TYPES: SportUserActionTypes[] = ['delete', 'add'];

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

    static async updateUser(type: SportUserActionTypes, userId: number, sportId: number) {
        const text = type === 'delete' ? deleteUserQuery() : addUserQuery();
        const result = await query({
            text,
            values: [userId, sportId]
        });

        return prepareDBResult(result);
    }
};
