import {
    getCountries as getCountriesQuery,
    addUser as addUserQuery,
    getUsers as getUsersQuery
} from '../query-creators/country-query-creators';
import {query, IResultError, IResultSuccess} from '../lib/db/client';
import {prepareResult, IGetLimit} from './base';

export default class CountryService {
    static async getCountries(): Promise<IResultError | IResultSuccess> {
        const result = await query({
            text: getCountriesQuery(),
            values: []
        });

        return prepareResult(result);
    }

    static async getUsers(data: IGetLimit, id: number): Promise<IResultError | IResultSuccess> {
        const result = await query({
            text: getUsersQuery(data.order),
            values: [data.limit, data.skip, id]
        });

        return prepareResult(result);
    }

    static async addUser(userId: number, countryId: number): Promise<IResultError | IResultSuccess> {
        const result = await query({
            text: addUserQuery(),
            values: [userId, countryId]
        });

        return prepareResult(result);
    }
};
