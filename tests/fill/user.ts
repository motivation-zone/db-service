import * as request from 'supertest';
import app from '../../src/app';

import UserModel, {IUserModel} from '../../src/models/user';
import {generateUser} from '../func/user/utils';
import {API_URLS} from '../../src/urls';

const userUrls = API_URLS.user;

export const createUsers = async (count: number): Promise<IUserModel[]> => {
    return await Promise.all((new Array(count).fill(true)).map(async () => {
        const user = generateUser();
        return await new Promise((resolve, reject) => {
            request(app)
                .post(`${userUrls.prefix}${userUrls.create}`)
                .send(user)
                .set('Accept', 'application/json')
                .end((err, res) => {
                    if (err || res.status !== 200) {
                        return reject(err || res.body);
                    }
                    resolve(new UserModel(res.body.data[0]));
                });
        });
    }));
};