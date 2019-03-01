import {expect} from 'chai';

import {dbActions as countryDbActions} from 'tests/helpers/country';
import {dbActions as userDbActions} from 'tests/helpers/user';
import {CREATED_USERS_COUNT, COUNTRIES_COUNT} from 'tests/const';

const {getAllCountries, getUsersByCountry} = countryDbActions;
const {getUsers} = userDbActions;

describe('Country:', () => {
    describe('Get', () => {
        it('all countries', async () => {
            const {data: countries} = await getAllCountries();
            expect(countries.length).to.equal(COUNTRIES_COUNT);
        });

        it('get users by countries', async () => {
            const {data: users} = await getUsers({limit: CREATED_USERS_COUNT, skip: 0});
            const [checkUser] = users.filter((user) => user.countryId);

            const {data: countryUsers} = await getUsersByCountry(checkUser.countryId!, {limit: 10, skip: 0});
            expect(countryUsers.length).be.greaterThan(0);
            countryUsers.forEach((user) => expect(user.countryId).to.equal(checkUser.countryId));
        });

        it('get users by countries ASC', async () => {
            const {data: users} = await getUsersByCountry(null, {limit: 10, skip: 0});
            expect(users.length).be.greaterThan(0);
            users.forEach((user) => expect(user.countryId).to.be.not.ok);

            const checkAsc = users.every((user, i) => {
                if (i === 0) {
                    return true;
                }

                return user.registeredDate! >= users[i - 1].registeredDate!;
            });
            expect(checkAsc).to.be.true;
        });

        it('get users by countries DESC', async () => {
            const {data: users} = await getUsersByCountry(null, {limit: 10, skip: 0, order: 'DESC'});
            expect(users.length).be.greaterThan(0);
            users.forEach((user) => expect(user.countryId).to.be.not.ok);

            const checkDesc = users.every((user, i) => {
                if (i === 0) {
                    return true;
                }

                return user.registeredDate! <= users[i - 1].registeredDate!;
            });
            expect(checkDesc).to.be.true;
        });

        it('get users by country with empty params', async () => {
            const {data: users} = await getUsers({limit: CREATED_USERS_COUNT, skip: 0});
            const [checkUser] = users.filter((user) => user.countryId);

            const {status} = await getUsersByCountry(checkUser.countryId!, {});
            expect(status).to.equal(400);
        });
    });
});
