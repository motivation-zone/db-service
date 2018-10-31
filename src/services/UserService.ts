import UserModel from '../models/UserModel';
import {
    createUser as createUserQuery,
    getUserByLogin as getUserByLoginQuery
} from '../query-creators/user-query-creators';
import {query} from '../lib/db/client';

export default class UserService {
    static async createUser(user: UserModel) {
        const values = [
            user.login, user.name, user.password, user.email,
            user.country, user.selfInfo, user.weight,
            user.growth, user.birthDate
        ];

        const result = await query({
            text: createUserQuery(),
            values
        });

        if (result.status === 'error') {
            return result;
        }

        const userResult = await query({
            text: getUserByLoginQuery(),
            values: [user.login]
        });

        return userResult;
    }

    static updateUser() {

    }

    static getUserById() {

    }

    static getUserByLogin() {

    }

    static getUsers() {

    }

    static deleteUser() {

    }
};
