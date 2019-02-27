import UserModel from 'src/models/user';
import {
    createUser as createUserQuery,
    getUserByLogin as getUserByLoginQuery,
    getUserById as getUserByIdQuery,
    getUsers as getUsersQuery,
    updateUser as updateUserQuery,
    deleteUser as deleteUserQuery,
    checkUser as checkUserQuery
} from 'src/query-creators/user';
import {query} from 'src/lib/db/client';
import {translateNodeToPostgresqlName} from 'src/utils/db/helper';
import {prepareDBResult, IGetLimit} from 'src/services/base';
import {getNotEmptyFields} from 'src/utils';

export default class UserService {
    static async createUser(user: UserModel): Promise<any[]> {
        const values = [
            user.login, user.name, user.password, user.email,
            user.selfInfo, user.gender, user.weight, user.growth,
            user.countryId, user.birthDate, user.instagram, user.phone
        ];

        const result = await query({
            text: createUserQuery(),
            values
        });

        return prepareDBResult(result);
    }

    static async updateUser(user: UserModel): Promise<any[]> {
        const fields = getNotEmptyFields(user) as (keyof UserModel)[];
        const result = await query({
            text: updateUserQuery(fields.map(translateNodeToPostgresqlName)),
            values: [
                user.id,
                ...fields.map((field) => user[field])
            ]
        });

        return prepareDBResult(result);
    }

    static async getUserById(id: number): Promise<any[]> {
        const result = await query({
            text: getUserByIdQuery(),
            values: [id]
        });

        return prepareDBResult(result);
    }

    static async getUserByLogin(login: string, strict = false): Promise<any[]> {
        const result = await query({
            text: getUserByLoginQuery(strict),
            values: [login]
        });

        return prepareDBResult(result);
    }

    static async getUsers(data: IGetLimit): Promise<any[]> {
        const result = await query({
            text: getUsersQuery(data.order),
            values: [data.limit, data.skip]
        });

        return prepareDBResult(result);
    }

    static async deleteUser(id: number): Promise<any[]> {
        const result = await query({
            text: deleteUserQuery(),
            values: [id]
        });

        return prepareDBResult(result);
    }

    static async checkUserPassword(login: string, password: string): Promise<any[]> {
        const result = await query({
            text: checkUserQuery(),
            values: [login, password]
        });

        return prepareDBResult(result);
    }
}
