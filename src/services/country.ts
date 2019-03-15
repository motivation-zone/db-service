import {
    getCountries as getCountriesQuery,
    getUsers as getUsersQuery,
    getUsersWithoutCountry as getUsersWithoutCountryQuery
} from 'src/query-creators/country';
import {query} from 'src/lib/db/client';
import {prepareDBResult, IGetLimit} from 'src/services/base';

export default class CountryService {
    static async getCountries(): Promise<any[]> {
        const result = await query({
            text: getCountriesQuery(),
            values: []
        });
        return prepareDBResult(result);
    }

    static async getUsers(limitParams: IGetLimit, countryId: number | null): Promise<any[]> {
        const result = await query({
            text: countryId ? getUsersQuery(limitParams.order) : getUsersWithoutCountryQuery(limitParams.order),
            values: [limitParams.limit, limitParams.skip].concat(countryId ? [countryId] : [])
        });

        return prepareDBResult(result);
    }
}
