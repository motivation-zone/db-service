import {IApiInterface, limitQueryParams} from 'tools/api-doc';
import {apiUrls} from 'src/urls';
import CountryModelInterface from 'src/models/country.interface';
import UserModelInterface from 'src/models/user.interface';

const urls = apiUrls.country;

export default {
    prefix: urls.prefix,
    methods: [
        {
            url: urls.getCountries,
            method: 'get',
            returns: `${CountryModelInterface.name}[]`
        },
        {
            url: urls.getUsersByCountry,
            method: 'get',
            query: limitQueryParams,
            returns: `${UserModelInterface.name}[]`,
            params: [{
                name: 'countryId',
                type: 'number | null'
            }]
        }
    ]
} as IApiInterface;
