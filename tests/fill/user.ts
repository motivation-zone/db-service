import * as request from 'supertest';
import app from '../../src/app';

import {generateUser} from '../func/user/utils';
import {API_URLS} from '../../src/urls';

const userUrls = API_URLS.user;

export const createUsers = async (count: number) => {
    for (let i = 0; i < count; i++) {
        const user = generateUser();
        await new Promise((resolve, reject) => {
            request(app)
                .post(`${userUrls.prefix}${userUrls.create}`)
                .send(user)
                .set('Accept', 'application/json')
                .end((err, res) => {
                    if (err || res.status !== 200) {
                        return reject(err || res.body);
                    }
                    resolve();
                });
        });
    }
};