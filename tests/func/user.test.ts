import * as request from 'supertest';
import {expect} from 'chai';
import app from '../../src/app';
import * as randomName from 'node-random-name';


import UserModel, {REQUIRED_FIELDS, NOT_UPDATED_FIELDS, IUserModel} from '../../src/models/UserModel';
import {generateString} from '../utils';

const URL_PREFIX = '/api/user';

const generateUser = (): IUserModel => {
    const gender = Math.random() > 0.5;
    return {
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
        birthDate: UserModel.parseDate('1997-06-01')
    };
};

describe('USER', () => {
    describe('CREATE', () => {
        let firstUser = generateUser();

        it('Simple create', (done) => {
            request(app)
                .post(`${URL_PREFIX}/create`)
                .send(firstUser)
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect((res) => {
                    const user = res.body.data[0];
                    // password mustn't return after user was created
                    expect(user.password).to.be.not.ok;
                    // add for correct check
                    user.password = firstUser.password;
                    // check the availability of id & registeredDate
                    expect(user.id).to.be.ok;
                    expect(user.registeredDate).to.be.ok;
                    // remove it, because it's not necessary for checking objects equals
                    delete user.id;
                    delete user.registeredDate;

                    user.countryId = Number(user.countryId);
                    res.body = user;
                })
                .expect(200, Object.assign({}, firstUser, {
                    birthDate: '1997-06-01T00:00:00.000Z',
                    isAthlete: false,
                    isBanned: false
                }), done);
        });

        it('Create with same email', (done) => {
            const user = generateUser();
            user.email = firstUser.email;
            request(app)
                .post(`${URL_PREFIX}/create`)
                .send(user)
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect((res) => {
                    const msg = res.body.message;
                    expect(msg.indexOf('users_email_key')).to.be.not.equal(-1);
                })
                .expect(409, done);
        });

        it('Create with same login', (done) => {
            const user = generateUser();
            user.login = firstUser.login;

            request(app)
                .post(`${URL_PREFIX}/create`)
                .send(user)
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect((res) => {
                    const msg = res.body.message;
                    expect(msg.indexOf('users_login_key')).to.be.not.equal(-1);
                })
                .expect(409, done);
        });

        it('Create without required fields', (done) => {
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

    /* describe('UPDATE', () => {
        it('Simple update', (done) => {
            // TODO два-три поля поменять
        });

        it('Update not updated fields', (done) => {

        });
    }); */
});


