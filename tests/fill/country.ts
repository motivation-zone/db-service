import request from 'supertest';
import app from '../../src/app';

import {API_URLS} from '../../src/urls';
import CountryModel, {ICountryModel} from '../../src/models/country';

const countryUrls = API_URLS.country;

export const getAllCountries = async (): Promise<ICountryModel[]> => {
    return await new Promise((resolve, reject) => {
        request(app)
            .get(`${countryUrls.prefix}${countryUrls.get}`)
            .set('Accept', 'application/json')
            .end((err: Error, res: request.Response) => {
                if (err || res.status !== 200) {
                    return reject(err || res.body);
                }
                resolve(res.body.data.map((country: any) => new CountryModel(country)));
            });
    });
};
