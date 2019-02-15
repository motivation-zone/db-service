import {
    getCountries as getCountriesQuery,
    getUsers as getUsersQuery,
    getUsersWithoutCountry as getUsersWithoutCountryQuery
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

    static async getUsers(data: IGetLimit, id?: number) {
        const result = await query({
            text: id ? getUsersQuery(data.order) : getUsersWithoutCountryQuery(data.order),
            values: [data.limit, data.skip].concat(id ? [id] : [])
        });

        return prepareDBResult(result);
    }
};
