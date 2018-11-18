import UserModel from '../models/UserModel';
import {
    createUser as createUserQuery,
    getUserByLogin as getUserByLoginQuery,
    getUserById as getUserByIdQuery,
    getUsers as getUsersQuery,
    updateUser as updateUserQuery,
    deleteUser as deleteUserQuery
} from '../query-creators/user';
import {query} from '../lib/db/client';
import {translateNodeToPostgresqlName} from '../utils/db/helper';
import {prepareDBResult, IGetLimit} from './base';
import {getNotEmptyFields} from '../utils/utils';

export default class UserService {
    static async createUser(user: UserModel) {
        const values = [
            user.login, user.name, user.password, user.email,
            user.selfInfo, user.weight, user.growth, user.birthDate,
            user.instagramLink, user.phone
        ];

        const result = await query({
            text: createUserQuery(),
            values
        });

        return prepareDBResult(result);
    }

    static async updateUser(user: UserModel) {
        const notUpdateFields = ['id', 'login', 'registered'];
        const fields = getNotEmptyFields(user, notUpdateFields) as (keyof UserModel)[];

        const result = await query({
            text: updateUserQuery(fields.map(translateNodeToPostgresqlName)),
            values: [
                user.id,
                ...fields.map((field) => user[field])
            ]
        });

        return prepareDBResult(result);
    }

    static async getUserById(id: number) {
        const result = await query({
            text: getUserByIdQuery(),
            values: [id]
        });

        return prepareDBResult(result);
    }

    static async getUserByLogin(login: string, strict?: boolean) {
        const result = await query({
            text: getUserByLoginQuery(strict),
            values: [login]
        });

        return prepareDBResult(result);
    }

    static async getUsers(data: IGetLimit) {
        const result = await query({
            text: getUsersQuery(data.order),
            values: [data.limit, data.skip]
        });

        return prepareDBResult(result);
    }

    static async deleteUser(id: number) {
        const result = await query({
            text: deleteUserQuery(),
            values: [id]
        });

        return prepareDBResult(result);
    }
};
