import request from 'supertest';
import {expect} from 'chai';

import app from 'src/app';
import {API_URLS} from 'src/urls';
import {getAllCountries} from 'tests/fill/country';
import {getUsers} from 'tests/fill/user';
import {CREATED_USERS_COUNT} from 'tests/const';
import UserModel, {IUserModel} from 'src/models/user';

const urls = API_URLS.country;
const REQUEST_HEADERS = {Accept: 'application/json'};
const RESPONSE_HEADERS: [string, RegExp] = ['Content-Type', /json/];

const COUNTRIES_COUNT = 247;

describe('Country:', () => {
    describe('Get', () => {
        it('all countries', async () => {
            const countries = await getAllCountries();
            expect(countries.length).to.equal(COUNTRIES_COUNT);
        });

        it('get users by countries', async () => {
            const users = await getUsers(CREATED_USERS_COUNT, 0);
            const usersWithCountry = users.filter((user) => user.countryId);
            const checkUser = usersWithCountry[0];

            await new Promise((resolve) => {
                request(app)
                    .get(`${urls.prefix}${urls.getUsers.replace(':id', String(checkUser.countryId))}?limit=10&skip=0`)
                    .set(REQUEST_HEADERS)
                    .expect(RESPONSE_HEADERS[0], RESPONSE_HEADERS[1])
                    .end((_, res) => {
                        const users: UserModel[] = res.body.data.map((userData: any) => new UserModel(userData));
                        expect(users.length).be.greaterThan(0);
                        users.forEach((user) => expect(user.countryId).to.equal(checkUser.countryId));
                        resolve();
                    });
            });
        });

        it('get users by countries ASC', (done) => {
            request(app)
                .get(`${urls.prefix}${urls.getUsers.replace(':id', 'null')}?limit=10&skip=0`)
                .set(REQUEST_HEADERS)
                .expect(RESPONSE_HEADERS[0], RESPONSE_HEADERS[1])
                .end((_, res) => {
                    const users: UserModel[] = res.body.data.map((userData: any) => new UserModel(userData));
                    expect(users.length).be.greaterThan(0);
                    users.forEach((user) => expect(user.countryId).to.be.not.ok);

                    const checkDesc = users.every((user: IUserModel, i: number) => {
                        if (i === 0) {
                            return true;
                        }

                        return user.registeredDate! >= users[i - 1].registeredDate!;
                    });
                    expect(checkDesc).to.be.true;
                    done();
                });
        });

        it('get users by countries DESC', (done) => {
            request(app)
            .get(`${urls.prefix}${urls.getUsers.replace(':id', 'null')}?limit=10&skip=0&order=DESC`)
                .set(REQUEST_HEADERS)
                .expect(RESPONSE_HEADERS[0], RESPONSE_HEADERS[1])
                .end((_, res) => {
                    const users: UserModel[] = res.body.data.map((userData: any) => new UserModel(userData));
                    expect(users.length).be.greaterThan(0);
                    users.forEach((user) => expect(user.countryId).to.be.not.ok);

                    const checkDesc = users.every((user: IUserModel, i: number) => {
                        if (i === 0) {
                            return true;
                        }

                        return user.registeredDate! <= users[i - 1].registeredDate!;
                    });
                    expect(checkDesc).to.be.true;
                    done();
                });
        });

        it('get users by countries with empty params', (done) => {
            request(app)
                .get(`${urls.prefix}${urls.getUsers}`)
                .set(REQUEST_HEADERS)
                .expect(RESPONSE_HEADERS[0], RESPONSE_HEADERS[1])
                .expect(400, done);
        });
    });
});
