import request from 'supertest';

import app from 'src/app';
import UserModel, {IUserModel} from 'src/models/user';
import {generateUser} from 'tests/func/user/utils';
import {API_URLS} from 'src/urls';
import {getAllCountries} from 'tests/fill/country';
import {intervalRandom} from 'src/utils';

const userUrls = API_URLS.user;

export const createUsers = async (count: number): Promise<IUserModel[]> => {
    const countries = await getAllCountries();

    // this array fill on 50/50 true/false for creating users with country and without
    const countsArray = [...new Array(count / 2).fill(true), ...new Array(count / 2).fill(false)];
    return await Promise.all((countsArray).map(async (isCountryExist) => {
        const countryId = intervalRandom(countries[0].id, countries[countries.length - 1].id);
        const user = generateUser({countryId: isCountryExist ? countryId : undefined});
        return await new Promise((resolve, reject) => {
            request(app)
                .post(`${userUrls.prefix}${userUrls.create}`)
                .send(user)
                .set('Accept', 'application/json')
                .end((err: Error, res: request.Response) => {
                    if (err || res.status !== 200) {
                        return reject(err || res.body);
                    }
                    resolve(new UserModel(res.body.data[0]));
                });
        });
    }));
};

export const getUsers = async (limit: number, skip: number): Promise<IUserModel[]> => {
    return await new Promise((resolve, reject) => {
        request(app)
            .get(`${userUrls.prefix}${userUrls.get}?limit=${limit}&skip=${skip}`)
            .set('Accept', 'application/json')
            .end((err: Error, res: request.Response) => {
                if (err || res.status !== 200) {
                    return reject(err || res.body);
                }
                resolve(res.body.data.map((user: any) => new UserModel(user)));
            });
    });
};
