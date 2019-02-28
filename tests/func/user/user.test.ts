import request from 'supertest';
import {expect, assert} from 'chai';

import app from 'src/app';
import UserModel, {IUserModel, REQUIRED_FIELDS, NOT_UPDATED_FIELDS} from 'src/models/user';
import {checkAssertion} from 'tests/utils';
import {USER_RETURNING_FIELDS} from 'src/query-creators/user';
import {translatePostgresqlNameToNode} from 'src/utils/db/helper';
import {checkRequiredFields} from 'src/utils';
import {API_URLS} from 'src/urls';
import {generateUser} from 'tests/func/user/utils';
import {getAllCountries} from 'tests/fill/country';

const urls = API_URLS.user;
const REQUEST_HEADERS = {Accept: 'application/json'};
const RESPONSE_HEADERS: [string, RegExp] = ['Content-Type', /json/];

describe('User:', (): void => {
    const reqUser = generateUser();

    describe('Create', () => {
        it('simple', async () => {
            const countries = await getAllCountries();
            reqUser.countryId = Number(countries[0].id);

            return await new Promise((resolve, _reject) => {
                request(app)
                    .post(`${urls.prefix}${urls.create}`)
                    .send(reqUser)
                    .set(REQUEST_HEADERS)
                    .expect(RESPONSE_HEADERS[0], RESPONSE_HEADERS[1])
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

                        user.countryId = user.countryId;

                        // save data for next check & next 'update' tests
                        reqUser.id = user.id;
                        reqUser.registeredDate = user.registeredDate;
                        reqUser.isAthlete = false;
                        reqUser.isBanned = false;

                        expect(user).to.deep.equal(reqUser);
                        resolve();
                    })
                    .expect(200, () => {});
            });
        });

        it('with not existing country id', (done) => {
            const user = generateUser();
            user.countryId = 99999999;

            request(app)
                .post(`${urls.prefix}${urls.create}`)
                .send(user)
                .set(REQUEST_HEADERS)
                .expect(RESPONSE_HEADERS[0], RESPONSE_HEADERS[1])
                .expect((res) => {
                    const {message} = res.body.err;
                    expect(message.includes('users_country_id_fkey')).to.be.true;
                })
                .expect(409, done);
        });

        it('with empty country id', (done) => {
            const user = generateUser();

            request(app)
                .post(`${urls.prefix}${urls.create}`)
                .send(user)
                .set(REQUEST_HEADERS)
                .expect(RESPONSE_HEADERS[0], RESPONSE_HEADERS[1])
                .expect((res) => {
                    const [userData] = res.body.data;
                    const userModel = new UserModel(userData);
                    expect(userModel.countryId).to.be.not.ok;
                })
                .expect(200, done);
        });

        it('with same email', (done) => {
            const user = generateUser();
            user.email = reqUser.email;

            request(app)
                .post(`${urls.prefix}${urls.create}`)
                .send(user)
                .set(REQUEST_HEADERS)
                .expect(RESPONSE_HEADERS[0], RESPONSE_HEADERS[1])
                .expect((res) => {
                    const {message} = res.body.err;
                    expect(message.includes('users_email_key')).to.be.true;
                })
                .expect(409, done);
        });

        it('with same login', (done) => {
            const user = generateUser();
            user.login = reqUser.login;

            request(app)
                .post(`${urls.prefix}${urls.create}`)
                .send(user)
                .set(REQUEST_HEADERS)
                .expect(RESPONSE_HEADERS[0], RESPONSE_HEADERS[1])
                .expect((res) => {
                    const {message} = res.body.err;
                    expect(message.includes('users_login_key')).to.be.true;
                })
                .expect(409, done);
        });

        it('without required fields', async () => {
            await Promise.all(REQUIRED_FIELDS.map((field) => {
                const user = generateUser();
                delete user[field];

                return new Promise((resolve, reject) => {
                    request(app)
                        .post(`${urls.prefix}${urls.create}`)
                        .send(user)
                        .set(REQUEST_HEADERS)
                        .expect(RESPONSE_HEADERS[0], RESPONSE_HEADERS[1])
                        .end((err, res) => {
                            if (err) {
                                reject(err);
                                return;
                            }

                            const {message} = res.body.err;
                            expect(message).to.equal(`"${field}" is required`);
                            expect(res.status).to.equal(400);
                            resolve();
                        });
                });
            }));
        });
    });

    describe('Update', () => {
        it('simple', async () => {
            const countries = await getAllCountries();
            const newUser = generateUser({
                isAthlete: true,
                isBanned: true,
                countryId: Number(countries[1].id)
            });

            const updatedFields = Object.keys(reqUser) as (keyof IUserModel)[];
            NOT_UPDATED_FIELDS.forEach((field) => {
                const i = updatedFields.indexOf(field);
                updatedFields.splice(i, 1);
            });

            await Promise.all(updatedFields.map((field) => {
                return new Promise((resolve, reject) => {
                    request(app)
                        .post(`${urls.prefix}${urls.updateById.replace(':id', String(reqUser.id))}`)
                        .send({[field]: newUser[field]})
                        .set(REQUEST_HEADERS)
                        .expect(RESPONSE_HEADERS[0], RESPONSE_HEADERS[1])
                        .end((err, res) => {
                            if (err) {
                                reject(err);
                                return;
                            }

                            const updatedUser = new UserModel(res.body.data[0]);
                            assert(
                                checkAssertion(updatedUser[field], newUser[field]),
                                `${field}: ${updatedUser[field]} != ${newUser[field]}`
                            );
                            // save data for next tests
                            reqUser[field] = updatedUser[field];
                            resolve();
                        });
                });
            }));
        });

        it('not updated fields with some updated field', async () => {
            await Promise.all(NOT_UPDATED_FIELDS.map((field) => {
                const newUser = generateUser();

                return new Promise((resolve, reject) => {
                    request(app)
                        .post(`${urls.prefix}${urls.updateById.replace(':id', String(reqUser.id))}`)
                        .send({
                            [field]: newUser[field],
                            // if send only not_updated_field => server remove it
                            // and send empty query => will be error 409 (next test)
                            selfInfo: newUser.selfInfo
                        })
                        .set(REQUEST_HEADERS)
                        .expect(RESPONSE_HEADERS[0], RESPONSE_HEADERS[1])
                        .end((err, res) => {
                            if (err) {
                                reject(err);
                                return;
                            }

                            const updatedUser = new UserModel(res.body.data[0]);
                            assert(
                                checkAssertion(updatedUser[field], reqUser[field]),
                                `${updatedUser[field]} != ${reqUser[field]}`
                            );
                            expect(updatedUser.selfInfo).to.equal(newUser.selfInfo);
                            // save data for next tests
                            reqUser.selfInfo = updatedUser.selfInfo;
                            resolve();
                        });
                });
            }));
        });

        it('only not updated fields', async () => {
            await Promise.all(NOT_UPDATED_FIELDS.map((field) => {
                const newUser = generateUser();

                return new Promise((resolve) => {
                    request(app)
                        .post(`${urls.prefix}${urls.updateById.replace(':id', String(reqUser.id))}`)
                        .send({[field]: newUser[field]})
                        .set(REQUEST_HEADERS)
                        .expect(RESPONSE_HEADERS[0], RESPONSE_HEADERS[1])
                        .expect(409, resolve);
                });
            }));
        });

        it('with not existing id', (done) => {
            request(app)
                .post(`${urls.prefix}${urls.updateById.replace(':id', '9999999')}`)
                .send({name: 'name'})
                .set(REQUEST_HEADERS)
                .expect(RESPONSE_HEADERS[0], RESPONSE_HEADERS[1])
                .end((_, res) => {
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
                .set(REQUEST_HEADERS)
                .expect(RESPONSE_HEADERS[0], RESPONSE_HEADERS[1])
                .end((_, res) => {
                    const result = res.body.data;
                    expect(result.length).to.equal(3);

                    const userReturningFields = USER_RETURNING_FIELDS.split(', ')
                        .map(translatePostgresqlNameToNode);

                    const userData = result[0];
                    expect(checkRequiredFields(userReturningFields, userData)).to.be.true;
                    done();
                });
        });

        it('should contains limit params', (done) => {
            request(app)
                .get(`${urls.prefix}/${urls.get}`)
                .set(REQUEST_HEADERS)
                .expect(RESPONSE_HEADERS[0], RESPONSE_HEADERS[1])
                .expect(400, done);
        });

        it('order params by default ASC', (done) => {
            request(app)
                .get(`${urls.prefix}/${urls.get}?limit=100&skip=0`)
                .set(REQUEST_HEADERS)
                .expect(RESPONSE_HEADERS[0], RESPONSE_HEADERS[1])
                .end((_, res) => {
                    const users = res.body.data.map((userData: any) => new UserModel(userData));
                    const checkDesc = users.every((user: IUserModel, i: number) => {
                        if (i === 0) {
                            return true;
                        }

                        return user.registeredDate! >= users[i - 1].registeredDate!;
                    });
                    expect(checkDesc).to.be.true;
                    expect(res.status).to.equal(200);
                    done();
                });
        });

        it('order params DESC', (done) => {
            request(app)
                .get(`${urls.prefix}/${urls.get}?limit=100&skip=0&order=DESC`)
                .set(REQUEST_HEADERS)
                .expect(RESPONSE_HEADERS[0], RESPONSE_HEADERS[1])
                .end((_, res) => {
                    const users = res.body.data.map((userData: any) => new UserModel(userData));
                    const checkDesc = users.every((user: IUserModel, i: number) => {
                        if (i === 0) {
                            return true;
                        }
                        return user.registeredDate! <= users[i - 1].registeredDate!;
                    });
                    expect(checkDesc).to.be.true;
                    expect(res.status).to.equal(200);
                    done();
                });
        });

        it('user by id', (done) => {
            request(app)
                .get(`${urls.prefix}/${urls.getById.replace(':id', String(reqUser.id))}`)
                .set(REQUEST_HEADERS)
                .expect(RESPONSE_HEADERS[0], RESPONSE_HEADERS[1])
                .end((_, res) => {
                    const user = new UserModel(res.body.data[0]);
                    user.password = reqUser.password;
                    expect(user).to.deep.equal(reqUser);
                    expect(res.status).to.equal(200);
                    done();
                });
        });

        it('user by login (strict)', (done) => {
            request(app)
                .get(`${urls.prefix}/${urls.getByLogin.replace(':login', String(reqUser.login))}`)
                .set(REQUEST_HEADERS)
                .expect(RESPONSE_HEADERS[0], RESPONSE_HEADERS[1])
                .end((_, res) => {
                    const user = new UserModel(res.body.data[0]);
                    user.password = reqUser.password;

                    expect(user).to.deep.equal(reqUser);
                    expect(res.status).to.equal(200);
                    done();
                });
        });

        it('user by login (not strict)', (done) => {
            request(app)
                .get(
                    `${urls.prefix}/${urls.getByLogin.replace(':login', '.')}?strict=false`
                )
                .set(REQUEST_HEADERS)
                .expect(RESPONSE_HEADERS[0], RESPONSE_HEADERS[1])
                .end((_, res) => {
                    const result = res.body.data;
                    expect(result.length > 0 && result.length <= 10).to.be.true;
                    expect(res.status).to.equal(200);
                    done();
                });
        });
    });

    describe('CHECK', () => {
        it('password', (done) => {
            request(app)
                .post(`${urls.prefix}/${urls.checkPassword}`)
                .send({login: reqUser.login, password: reqUser.password})
                .set(REQUEST_HEADERS)
                .expect(RESPONSE_HEADERS[0], RESPONSE_HEADERS[1])
                .end((_, res) => {
                    const result = res.body.data;
                    const user = new UserModel(result[0]);
                    expect(result.length === 1).to.be.true;

                    expect(user.id).to.equal(reqUser.id);
                    expect(res.status).to.equal(200);
                    done();
                });
        });
    });

    describe('DELETE', () => {
        it('by id', async () => {
            await new Promise((resolve) => {
                request(app)
                    .delete(`${urls.prefix}/${urls.deleteById.replace(':id', String(reqUser.id))}`)
                    .set(REQUEST_HEADERS)
                    .expect(RESPONSE_HEADERS[0], RESPONSE_HEADERS[1])
                    .end((_, res) => {
                        const user = new UserModel(res.body.data[0]);
                        user.password = reqUser.password;

                        expect(user).to.deep.equal(reqUser);
                        expect(res.status).to.equal(200);
                        resolve();
                    });
            });

            await new Promise((resolve) => {
                request(app)
                    .get(`${urls.prefix}/${urls.getById.replace(':id', String(reqUser.id))}`)
                    .set(REQUEST_HEADERS)
                    .expect(RESPONSE_HEADERS[0], RESPONSE_HEADERS[1])
                    .end((_, res) => {
                        const result = res.body.data;
                        expect(result.length === 0).to.be.true;
                        expect(res.status).to.equal(200);
                        resolve();
                    });
            });
        });
    });
});
