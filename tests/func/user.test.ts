import * as request from 'supertest';
import {expect, assert} from 'chai';
import app from '../../src/app';
import * as randomName from 'node-random-name';

import UserModel, {REQUIRED_FIELDS, NOT_UPDATED_FIELDS, IUserModel} from '../../src/models/UserModel';
import {generateString, checkAssertion} from '../utils';

const URL_PREFIX = '/api/user';

const generateUser = (): IUserModel => {
    const gender = Math.random() > 0.5;
    return new UserModel({
        login: randomName({
            first: true,
            gender: gender ? 'male' : 'female'
        }),
        name: randomName(),
        password: generateString(10),
        email: `${randomName({last: true})}@amail.ru`,
        selfInfo: 'smth about me',
        gender,
        countryId: 183,
        weight: 74.5,
        growth: 175,
        instagram: 'instagramnickname',
        phone: '7_123123123123',
        birthDate: '1997-06-01'
    });
};

const changeFieldValue = (field: string, value: any) => {
    if (value instanceof Date) {
        return UserModel.parseDate('1999-06-01');
    }

    if (typeof value === 'string') {
        return `${value}_extra_text`;
    }

    if (typeof value === 'number') {
        return ++value;
    }

    if (typeof value === 'boolean') {
        return !value;
    }
};

describe('USER:', function () {
    this.timeout(5000);
    const reqUser = generateUser();

    describe('Create', () => {
        it('simple', (done) => {
            request(app)
                .post(`${URL_PREFIX}/create`)
                .send(reqUser)
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect((res) => {
                    const user = new UserModel(res.body.data[0]);
                    // password mustn't return after user was created
                    expect(user.password).to.be.not.ok;
                    // default values
                    expect(user.isAthlete).to.be.false;
                    expect(user.isBanned).to.be.false;
                    // add for correct check
                    user.password = reqUser.password;
                    // check the availability of id & registeredDate
                    expect(user.id).to.be.ok;
                    expect(user.registeredDate).to.be.ok;

                    user.countryId = Number(user.countryId);

                    // save data for next check & next 'update' tests
                    reqUser.id = user.id;
                    reqUser.registeredDate = user.registeredDate;
                    reqUser.isAthlete = false;
                    reqUser.isBanned = false;

                    expect(user).to.deep.equal(reqUser);
                })
                .expect(200, done);
        });

        it('with not existing country id', (done) => {
            const user = generateUser();
            user.countryId = 9999999;

            request(app)
                .post(`${URL_PREFIX}/create`)
                .send(user)
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect((res) => {
                    const msg = res.body.message;
                    expect(msg.indexOf('users_country_id_fkey')).to.not.equal(-1);
                })
                .expect(409, done);
        });

        it('with same email', (done) => {
            const user = generateUser();
            user.email = reqUser.email;
            request(app)
                .post(`${URL_PREFIX}/create`)
                .send(user)
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect((res) => {
                    const msg = res.body.message;
                    expect(msg.indexOf('users_email_key')).to.not.equal(-1);
                })
                .expect(409, done);
        });

        it('with same login', (done) => {
            const user = generateUser();
            user.login = reqUser.login;

            request(app)
                .post(`${URL_PREFIX}/create`)
                .send(user)
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect((res) => {
                    const msg = res.body.message;
                    expect(msg.indexOf('users_login_key')).to.not.equal(-1);
                })
                .expect(409, done);
        });

        it('without required fields', (done) => {
            const promises = REQUIRED_FIELDS.map((field) => {
                const user = generateUser();
                delete user[field];

                return new Promise((resolve, reject) => {
                    request(app)
                        .post(`${URL_PREFIX}/create`)
                        .send(user)
                        .set('Accept', 'application/json')
                        .expect('Content-Type', /json/)
                        .end((err, res) => {
                            if (err || res.status !== 400) {
                                return reject();
                            }
                            resolve();
                        });
                });
            });

            Promise.all(promises).then(() => done());
        });

    });

    describe('Update', () => {
        it('simple', (done) => {
            const updatedFields = Object.keys(reqUser) as (keyof IUserModel)[];
            NOT_UPDATED_FIELDS.forEach((field) => {
                const i = updatedFields.indexOf(field);
                updatedFields.splice(i, 1);
            });

            const promises = updatedFields.map((field) => {
                reqUser[field] = changeFieldValue(field, reqUser[field]);
                return new Promise((resolve, reject) => {
                    request(app)
                        .post(`${URL_PREFIX}/update/${reqUser.id}`)
                        .send({[field]: reqUser[field]})
                        .set('Accept', 'application/json')
                        .expect('Content-Type', /json/)
                        .end((err, res) => {
                            if (err || res.status !== 200) {
                                return reject();
                            }

                            const user = new UserModel(res.body.data[0]);
                            assert(
                                checkAssertion(user[field], reqUser[field]),
                                `${user[field]} != ${reqUser[field]}`
                            );
                            resolve();
                        });
                });
            });

            Promise.all(promises).then(() => done());
        });

        it('not updated fields with some updated field', (done) => {
            const promises = NOT_UPDATED_FIELDS.map((field) => {
                const newValue = changeFieldValue(field, reqUser[field]);
                return new Promise((resolve, reject) => {
                    request(app)
                        .post(`${URL_PREFIX}/update/${reqUser.id}`)
                        .send({
                            [field]: newValue,
                            // if send only not_updated_field => server remove it
                            // and send empty query => will be error 409
                            selfInfo: reqUser.selfInfo
                        })
                        .set('Accept', 'application/json')
                        .expect('Content-Type', /json/)
                        .end((err, res) => {
                            if (err || res.status !== 200) {
                                return reject();
                            }

                            const user = new UserModel(res.body.data[0]);
                            assert(
                                checkAssertion(user[field], reqUser[field]),
                                `${user[field]} != ${reqUser[field]}`
                            );
                            resolve();
                        });
                });
            });

            Promise.all(promises).then(() => done());
        });

        it('only not updated fields', (done) => {
            const promises = NOT_UPDATED_FIELDS.map((field) => {
                const newValue = changeFieldValue(field, reqUser[field]);
                return new Promise((resolve, reject) => {
                    request(app)
                        .post(`${URL_PREFIX}/update/${reqUser.id}`)
                        .send({[field]: newValue})
                        .set('Accept', 'application/json')
                        .expect('Content-Type', /json/)
                        .expect(409, resolve);
                });
            });

            Promise.all(promises).then(() => done());
        });

        /* it('with not existing id', (done) => {

        }); */
    });

    describe('Get', () => {
        /* it('users', (done) => {

        });

        it('user by id', (done) => {

        });

        it('user by login', (done) => {

        }); */
    });

    describe('CHECK', () => {
        /* it('password', (done) => {

        }); */
    });

    describe('DELETE', () => {
        /* it('by id', (done) => {

        }); */
    });
});


