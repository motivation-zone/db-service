import * as request from 'supertest';
import app from '../../src/app';
import {API_URL_PREFIX_USER} from '../../src/urls';
import {generateUser} from '../func/user/utils';

export default async () => {
    for (let i = 0; i < 10; i++) {
        const user = generateUser();
        await new Promise((resolve, reject) => {
            request(app)
                .post(`${API_URL_PREFIX_USER}/create`)
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