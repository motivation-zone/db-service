import {expect} from 'chai';

import {dbActions as sportDbActions} from 'tests/helpers/sport';
import {dbActions as userDbActions, generateUser} from 'tests/helpers/user';
import {SPORTS_COUNT} from 'tests/fill/const';
import {checkOrder} from 'tests/utils';
import LinkUserSportModel from 'src/models/link/user-sport';

const {insertUser} = userDbActions;
const {
    getAllSports,
    insertUserSportLink,
    getUsersBySport,
    deleteUserSportLink
} = sportDbActions;

const LIMIT_PARAMS = {limit: 100, skip: 0};

describe('Sport:', () => {
    describe('Get sports', () => {
        it('all', async () => {
            const {data: sports} = await getAllSports();
            expect(sports.length).to.equal(SPORTS_COUNT);
        });
    });

    describe('Get users', () => {
        it('by sports with order param = ASC', async () => {
            const {data: [sport]} = await getAllSports();
            const {data: users} = await getUsersBySport(sport.id!, LIMIT_PARAMS);
            expect(users.length).be.greaterThan(0);

            const checkAsc = checkOrder(users, 'ASC', (user) => user.registeredDate);
            expect(checkAsc).to.be.true;
        });

        it('by sports with order param = DESC', async () => {
            const {data: [sport]} = await getAllSports();
            const {data: users} = await getUsersBySport(sport.id!, Object.assign({}, LIMIT_PARAMS, {order: 'DESC'}));
            expect(users.length).be.greaterThan(0);

            const checkDesc = checkOrder(users, 'DESC', (user) => user.registeredDate);
            expect(checkDesc).to.be.true;
        });

        it('by sport without limit params', async () => {
            const {data: [sport]} = await getAllSports();
            const {status} = await getUsersBySport(sport.id!, {});
            expect(status).to.equal(400);
        });
    });

    describe('Update user-sport link', () => {
        it('delete', async () => {
            const {data: [sport]} = await getAllSports();
            const {data: [deletedUser]} = await getUsersBySport(sport.id!, LIMIT_PARAMS);
            const linkUserSport = new LinkUserSportModel({sportId: sport.id, userId: deletedUser.id});
            await deleteUserSportLink(linkUserSport);

            const {data: users} = await getUsersBySport(sport.id!, LIMIT_PARAMS);
            const checkUser = users.find((user) => deletedUser.id === user.id);
            expect(checkUser).to.be.not.ok;
        });

        it('add', async () => {
            const {data: [sport]} = await getAllSports();
            const userData = await generateUser();
            const {data: [newUser]} = await insertUser(userData);
            const linkUserSport = new LinkUserSportModel({sportId: sport.id, userId: newUser.id});
            await insertUserSportLink(linkUserSport);
            const {data: users} = await getUsersBySport(sport.id!, LIMIT_PARAMS);

            const checkUser = users.find((user) => newUser.id === user.id);
            expect(checkUser!.id).to.equal(newUser.id);
        });
    });
});
