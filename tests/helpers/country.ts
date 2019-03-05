import request from 'supertest';

import app from 'src/app';
import {API_URLS} from 'src/urls';
import CountryModel, {ICountryModel} from 'src/models/country';
import {IResponse, formResponse} from 'src/utils/http/response';
import {IGetLimitTest} from 'tests/utils';
import UserModel, {IUserModel} from 'src/models/user';
import {formQueryString} from 'src/utils';

const urls = API_URLS.country;
const REQUEST_HEADERS = {Accept: 'application/json'};

const getAllCountries = async (): Promise<IResponse<ICountryModel[]>> => {
    return await new Promise((resolve, reject) => {
        request(app)
            .get(`${urls.prefix}${urls.get}`)
            .set(REQUEST_HEADERS)
            .end((error, response) => {
                if (error) {
                    return reject(error);
                }

                const result = formResponse<CountryModel>(response, CountryModel);
                resolve(result);
            });
    });
};

const getUsersByCountry = async (
    countryId: number | null, queryParams: IGetLimitTest
): Promise<IResponse<IUserModel[]>> => {
    return await new Promise((resolve, reject) => {
        request(app)
            .get([
                `${urls.prefix}${urls.getUsers.replace(':countryId', String(countryId))}`,
                `?${formQueryString(queryParams)}`
            ].join(''))
            .set(REQUEST_HEADERS)
            .end((error, response) => {
                if (error) {
                    return reject(error);
                }

                const result = formResponse<IUserModel>(response, UserModel);
                resolve(result);
            });
    });
};

export const dbActions = {
    getAllCountries,
    getUsersByCountry
};
