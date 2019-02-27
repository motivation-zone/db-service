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
    return await Promise.all((new Array(count).fill(true)).map(async () => {
        const countryId = intervalRandom(countries[0].id, countries[countries.length - 1].id);
        const user = generateUser({countryId});
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
