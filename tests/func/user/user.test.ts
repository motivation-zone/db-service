import * as request from 'supertest';
import {expect, assert} from 'chai';
import app from '../../../src/app';

import UserModel, {REQUIRED_FIELDS, NOT_UPDATED_FIELDS, IUserModel} from '../../../src/models/UserModel';
import {checkAssertion, REQUEST_HEADERS, EXPECT_FIELDS} from '../../utils';
import {USER_RETURNING_FIELDS} from '../../../src/query-creators/user';
import {translatePostgresqlNameToNode} from '../../../src/utils/db/helper';
import {checkNecessaryFields} from '../../../src/utils/utils';
import {API_URLS} from '../../../src/urls';
import {generateUser} from './utils';

const urls = API_URLS.user;

const changeFieldValue = (value: any) => {
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
                .post(`${urls.prefix}${urls.create}`)
                .send(reqUser)
                .set(REQUEST_HEADERS.standart)
                .expect(EXPECT_FIELDS.json[0], EXPECT_FIELDS.json[1])
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

        it('with same email', (done) => {
            const user = generateUser();
            user.email = reqUser.email;
            request(app)
                .post(`${urls.prefix}${urls.create}`)
                .send(user)
                .set(REQUEST_HEADERS.standart)
                .expect(EXPECT_FIELDS.json[0], EXPECT_FIELDS.json[1])
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
                .post(`${urls.prefix}${urls.create}`)
                .send(user)
                .set(REQUEST_HEADERS.standart)
                .expect(EXPECT_FIELDS.json[0], EXPECT_FIELDS.json[1])
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
                        .post(`${urls.prefix}${urls.create}`)
                        .send(user)
                        .set(REQUEST_HEADERS.standart)
                        .expect(EXPECT_FIELDS.json[0], EXPECT_FIELDS.json[1])
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
                reqUser[field] = changeFieldValue(reqUser[field]);
                return new Promise((resolve, reject) => {
                    request(app)
                        .post(`${urls.prefix}${urls.updateById.replace(':id', String(reqUser.id))}`)
                        .send({[field]: reqUser[field]})
                        .set(REQUEST_HEADERS.standart)
                        .expect(EXPECT_FIELDS.json[0], EXPECT_FIELDS.json[1])
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
                const newValue = changeFieldValue(reqUser[field]);
                return new Promise((resolve, reject) => {
                    request(app)
                        .post(`${urls.prefix}${urls.updateById.replace(':id', String(reqUser.id))}`)
                        .send({
                            [field]: newValue,
                            // if send only not_updated_field => server remove it
                            // and send empty query => will be error 409
                            selfInfo: reqUser.selfInfo
                        })
                        .set(REQUEST_HEADERS.standart)
                        .expect(EXPECT_FIELDS.json[0], EXPECT_FIELDS.json[1])
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
                const newValue = changeFieldValue(reqUser[field]);
                return new Promise((resolve, reject) => {
                    request(app)
                        .post(`${urls.prefix}${urls.updateById.replace(':id', String(reqUser.id))}`)
                        .send({[field]: newValue})
                        .set(REQUEST_HEADERS.standart)
                        .expect(EXPECT_FIELDS.json[0], EXPECT_FIELDS.json[1])
                        .expect(409, resolve);
                });
            });

            Promise.all(promises).then(() => done());
        });

        it('with not existing id', (done) => {
            request(app)
                .post(`${urls.prefix}${urls.updateById.replace(':id', '9999999')}`)
                .send({name: 'name'})
                .set(REQUEST_HEADERS.standart)
                .expect(EXPECT_FIELDS.json[0], EXPECT_FIELDS.json[1])
                .end((err, res) => {
                    const result = res.body.data;
                    expect(result).to.be.empty;
                    expect(res.status).to.equal(200);
                    done();
                });
        });
    });

    describe('Get', () => {
        it('users', (done) => {
            request(app)
                .get(`${urls.prefix}/${urls.get}?limit=3&skip=0`)
                .set(REQUEST_HEADERS.standart)
                .expect(EXPECT_FIELDS.json[0], EXPECT_FIELDS.json[1])
                .end((err, res) => {
                    const result = res.body.data;
                    expect(result.length).to.equal(3);

                    const userReturningFields = USER_RETURNING_FIELDS.split(', ')
                        .map(translatePostgresqlNameToNode);

                    const userData = result[0];
                    expect(checkNecessaryFields(userReturningFields, userData)).to.be.true;
                    done();
                });
        });

        it('should contains limit params', (done) => {
            request(app)
                .get(`${urls.prefix}/${urls.get}`)
                .set(REQUEST_HEADERS.standart)
                .expect(EXPECT_FIELDS.json[0], EXPECT_FIELDS.json[1])
                .expect(400, done);
        });

        it('order params by default ASC', (done) => {
            request(app)
                .get(`${urls.prefix}/${urls.get}?limit=100&skip=0`)
                .set(REQUEST_HEADERS.standart)
                .expect(EXPECT_FIELDS.json[0], EXPECT_FIELDS.json[1])
                .end((err, res) => {
                    const result = res.body.data;
                    result.every((user: IUserModel, i: number) => {
                        if (i === 0) {
                            return true;
                        }
                        return Number(user.id) > Number(result[i - 1].id);
                    });
                    expect(res.status).to.equal(200);
                    done();
                });
        });

        it('order params DESC', (done) => {
            request(app)
                .get(`${urls.prefix}/${urls.get}?limit=100&skip=0&order=desc`)
                .set(REQUEST_HEADERS.standart)
                .expect(EXPECT_FIELDS.json[0], EXPECT_FIELDS.json[1])
                .end((err, res) => {
                    const result = res.body.data;
                    result.every((user: IUserModel, i: number) => {
                        if (i === 0) {
                            return true;
                        }
                        return Number(user.id) < Number(result[i - 1].id);
                    });
                    expect(res.status).to.equal(200);
                    done();
                });
        });

        /* it('user by id', (done) => {

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


