import {expect} from 'chai';

import {dbActions as countryDbActions} from 'tests/helpers/country';
import {dbActions as userDbActions} from 'tests/helpers/user';
import {COUNTRIES_COUNT} from 'tests/fill/const';
import {checkOrder} from 'tests/utils';

const {getAllCountries, getUsersByCountry} = countryDbActions;
const {getUsers} = userDbActions;

const LIMIT_PARAMS = {limit: 100, skip: 0};

describe('Country:', () => {
    describe('Get countries', () => {
        it('all', async () => {
            const {data: countries} = await getAllCountries();
            expect(countries.length).to.equal(COUNTRIES_COUNT);
        });
    });

    describe('Get users', () => {
        it('by country', async () => {
            const {data: users} = await getUsers(LIMIT_PARAMS);
            const [checkUser] = users.filter((user) => user.countryId);

            const {data: countryUsers} = await getUsersByCountry({
                countryId: checkUser.countryId,
                limitParams: LIMIT_PARAMS
            });
            expect(countryUsers.length).be.greaterThan(0);
            countryUsers.forEach((user) => expect(user.countryId).to.equal(checkUser.countryId));
        });

        it('by country with order param = ASC', async () => {
            const {data: users} = await getUsersByCountry({
                countryId: null,
                limitParams: LIMIT_PARAMS
            });
            expect(users.length).be.greaterThan(0);
            users.forEach((user) => expect(user.countryId).to.be.not.ok);

            const checkAsc = checkOrder(users, 'ASC', (user) => user.registeredDate);
            expect(checkAsc).to.be.true;
        });

        it('by country with order param = DESC', async () => {
            const {data: users} = await getUsersByCountry({
                countryId: null,
                limitParams: Object.assign({}, LIMIT_PARAMS, {order: 'DESC'})
            });
            expect(users.length).be.greaterThan(0);
            users.forEach((user) => expect(user.countryId).to.be.not.ok);

            const checkDesc = checkOrder(users, 'DESC', (user) => user.registeredDate);
            expect(checkDesc).to.be.true;
        });

        it('by country without limit params', async () => {
            const {data: users} = await getUsers(LIMIT_PARAMS);
            const [checkUser] = users.filter((user) => user.countryId);

            const {status} = await getUsersByCountry({
                countryId: checkUser.countryId!,
                limitParams: {}
            });

            expect(status).to.equal(400);
        });
    });
});
