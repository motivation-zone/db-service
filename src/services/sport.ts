import {
    getSports as getSportsQuery,
    addUser as addUserQuery,
    deleteUser as deleteUserQuery,
    getUsers as getUsersQuery,
    getUsersSport as getUserSportsQuery
} from 'src/query-creators/sport';
import {query} from 'src/lib/db/client';
import {prepareDBResult, IGetLimit} from 'src/services/base';
import {ILinkUserSportModel} from 'src/models/link/user-sport';

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

    static async getUsers(limitParams: IGetLimit, sportId: number): Promise<any[]> {
        const result = await query({
            text: getUsersQuery(limitParams.order),
            values: [limitParams.limit, limitParams.skip, sportId]
        });

        return prepareDBResult(result);
    }

    static async getUserSports(userId: number): Promise<any[]> {
        const result = await query({
            text: getUserSportsQuery(),
            values: [userId]
        });

        return prepareDBResult(result);
    }

    static async updateUser(actionType: UserSportActionType, linkUserSport: ILinkUserSportModel): Promise<any[]> {
        const text = actionType === UserSportActionType.DELETE ? deleteUserQuery() : addUserQuery();
        const {userId, sportId} = linkUserSport;
        const result = await query({
            text,
            values: [userId, sportId]
        });

        return prepareDBResult(result);
    }
}
