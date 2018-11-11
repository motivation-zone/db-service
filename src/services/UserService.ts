import UserModel from '../models/UserModel';
import {
    createUser as createUserQuery,
    getUserByLogin as getUserByLoginQuery,
    getUserById as getUserByIdQuery,
    getUsers as getUsersQuery,
    updateUser as updateUserQuery,
    deleteUser as deleteUserQuery
} from '../query-creators/user-query-creators';
import {query, IResultError, IResultSuccess} from '../lib/db/client';
import {translateNodeToPostgresqlName} from '../utils/db';
import {prepareResult, IGetLimit} from './base';

export default class UserService {
    static async createUser(user: UserModel): Promise<IResultError | IResultSuccess> {
        const values = [
            user.login, user.name, user.password, user.email,
            user.selfInfo, user.weight, user.growth, user.birthDate
        ];

        const result = await query({
            text: createUserQuery(),
            values
        });

        return prepareResult(result);
    }

    static async updateUser(user: UserModel) {
        const notUpdateFields = ['id', 'login', 'registered'];
        const fields = (Object.keys(user) as (keyof UserModel)[]).filter((field) => {
            return !notUpdateFields.includes(field);
        }).filter((field) => {
            if (typeof user[field] === 'boolean') {
                return true;
            }

            return Boolean(user[field]);
        });

        const result = await query({
            text: updateUserQuery(fields.map(translateNodeToPostgresqlName)),
            values: [
                user.id,
                ...fields.map((field) => user[field])
            ]
        });

        return prepareResult(result);
    }

    static async getUserById(id: number): Promise<IResultError | IResultSuccess> {
        const result = await query({
            text: getUserByIdQuery(),
            values: [id]
        });

        return prepareResult(result);
    }

    static async getUserByLogin(login: string, strict?: boolean): Promise<IResultError | IResultSuccess> {
        const result = await query({
            text: getUserByLoginQuery(strict),
            values: [login]
        });

        return prepareResult(result);
    }

    static async getUsers(data: IGetLimit): Promise<IResultError | IResultSuccess> {
        const result = await query({
            text: getUsersQuery(data.order),
            values: [data.limit, data.skip]
        });

        return prepareResult(result);
    }

    static async deleteUser(id: number) {
        const result = await query({
            text: deleteUserQuery(),
            values: [id]
        });

        return prepareResult(result);
    }
};
