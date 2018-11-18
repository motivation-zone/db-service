import {
    getCountries as getCountriesQuery,
    addUser as addUserQuery,
    getUsers as getUsersQuery
} from '../query-creators/country';
import {query} from '../lib/db/client';
import {prepareDBResult, IGetLimit} from './base';

export default class CountryService {
    static async getCountries() {
        const result = await query({
            text: getCountriesQuery(),
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

    static async addUser(userId: number, countryId: number) {
        const result = await query({
            text: addUserQuery(),
            values: [userId, countryId]
        });

        return prepareDBResult(result);
    }
};
