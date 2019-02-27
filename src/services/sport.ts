import {
    getSports as getSportsQuery,
    addUser as addUserQuery,
    deleteUser as deleteUserQuery,
    getUsers as getUsersQuery
} from 'src/query-creators/sport';
import {query} from 'src/lib/db/client';
import {prepareDBResult, IGetLimit} from 'src/services/base';

enum SportUserActionType {
    DELETE = 'delete',
    ADD = 'add'
}

export const SPORT_USER_ACTION_TYPES: SportUserActionType[] = [
    SportUserActionType.DELETE,
    SportUserActionType.ADD
];

export default class SportService {
    static async getSports(): Promise<any[]> {
        const result = await query({
            text: getSportsQuery(),
            values: []
        });

        return prepareDBResult(result);
    }

    static async getUsers(data: IGetLimit, id: number): Promise<any[]> {
        const result = await query({
            text: getUsersQuery(data.order),
            values: [data.limit, data.skip, id]
        });

        return prepareDBResult(result);
    }

    static async updateUser(actionType: SportUserActionType, userId: number, sportId: number): Promise<any[]> {
        const text = actionType === SportUserActionType.DELETE ? deleteUserQuery() : addUserQuery();
        const result = await query({
            text,
            values: [userId, sportId]
        });

        return prepareDBResult(result);
    }
}
