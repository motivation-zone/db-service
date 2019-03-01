import {
    getSports as getSportsQuery,
    addUser as addUserQuery,
    deleteUser as deleteUserQuery,
    getUsers as getUsersQuery,
    getUsersSport as getUserSportsQuery
} from 'src/query-creators/sport';
import {query} from 'src/lib/db/client';
import {prepareDBResult, IGetLimit} from 'src/services/base';

export enum UserSportActionType {
    DELETE = 'delete',
    ADD = 'add'
}

export const SPORT_USER_ACTION_TYPES: UserSportActionType[] = [
    UserSportActionType.DELETE,
    UserSportActionType.ADD
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

    static async getUserSports(id: number): Promise<any[]> {
        const result = await query({
            text: getUserSportsQuery(),
            values: [id]
        });

        return prepareDBResult(result);
    }

    static async updateUser(actionType: UserSportActionType, userId: number, sportId: number): Promise<any[]> {
        const text = actionType === UserSportActionType.DELETE ? deleteUserQuery() : addUserQuery();
        const result = await query({
            text,
            values: [userId, sportId]
        });

        return prepareDBResult(result);
    }
}
