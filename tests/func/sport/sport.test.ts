/* import * as request from 'supertest';
import {expect, assert} from 'chai';
import app from '../../../src/app';

import {API_URLS} from '../../../src/urls';
import {checkAssertion, REQUEST_HEADERS, EXPECT_FIELDS} from '../../utils';

const urls = API_URLS.user;

describe('Sport:', function () {
    this.timeout(5000);

    describe('Get', () => {
        it('all sports', (done) => {
            done();
            request(app)
                .post(`${urls.prefix}${urls.create}`)
                .send(user)
                .set(REQUEST_HEADERS.standart)
                .expect(EXPECT_FIELDS.json[0], EXPECT_FIELDS.json[1])
                .expect((res) => {
                    const msg = res.body.message;
                    expect(msg.indexOf('users_country_id_fkey')).to.not.equal(-1);
                })
                .expect(409, done);
        });

        it('get users by sports', (done) => {
            done();
        });
    });

    describe('Update', () => {
        it('delete', (done) => {
            done();
        });

        it('add', (done) => {
            done();
        });
    });
}) */