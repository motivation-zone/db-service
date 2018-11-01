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

export default class UserService {
    static async createUser(user: UserModel): Promise<IResultError | IResultSuccess> {
        const values = [
            user.login, user.name, user.password, user.email,
            user.country, user.selfInfo, user.weight,
            user.growth, user.birthDate
        ];

        const result = await query({
            text: createUserQuery(),
            values
        });

        return result;
    }

    static async updateUser(user: UserModel) {
        const notUpdateFields = ['id', 'login', 'registered'];
        const fields = (Object.keys(user) as (keyof UserModel)[]).filter((field) => {
            return !notUpdateFields.includes(field) || Boolean(user[field]);
        });

        const result = await query({
            text: updateUserQuery(fields.map(translateNodeToPostgresqlName)),
            values: [
                user.id,
                ...fields.map((field) => user[field])
            ]
        });

        return result;
    }

    static async getUserById(id: number): Promise<IResultError | IResultSuccess> {
        return await query({
            text: getUserByIdQuery(),
            values: [id]
        });
    }

    static async getUserByLogin(login: string): Promise<IResultError | IResultSuccess> {
        return await query({
            text: getUserByLoginQuery(),
            values: [login]
        });
    }

    static async getUsers(limit: number, skip: number, isDesc: boolean): Promise<IResultError | IResultSuccess> {
        return await query({
            text: getUsersQuery(isDesc),
            values: [limit, skip]
        });
    }

    static async deleteUser(id: number) {
        return await query({
            text: deleteUserQuery(),
            values: [id]
        });
    }
};
