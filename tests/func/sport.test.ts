import {expect} from 'chai';

import {dbActions as sportDbActions} from 'tests/helpers/sport';
import {SPORTS_COUNT} from 'tests/const';
import {dbActions as userDbActions, generateUser} from 'tests/helpers/user';

const {insertUser} = userDbActions;
const {
    getAllSports,
    insertUserSportLink,
    getUsersBySport,
    deleteUserSportLink
} = sportDbActions;

describe('Sport:', () => {
    describe('Get', () => {
        it('all sports', async () => {
            const {data: sports} = await getAllSports();
            expect(sports.length).to.equal(SPORTS_COUNT);
        });

        it('get users by sports ASC', async () => {
            const {data: [sport]} = await getAllSports();
            const {data: users} = await getUsersBySport(sport.id!, {limit: 10, skip: 0});
            expect(users.length).be.greaterThan(0);

            const checkAsc = users.every((user, i) => {
                if (i === 0) {
                    return true;
                }

                return user.registeredDate! >= users[i - 1].registeredDate!;
            });
            expect(checkAsc).to.be.true;
        });

        it('get users by sports DESC', async () => {
            const {data: [sport]} = await getAllSports();
            const {data: users} = await getUsersBySport(sport.id!, {limit: 10, skip: 0, order: 'DESC'});
            expect(users.length).be.greaterThan(0);

            const checkDesc = users.every((user, i) => {
                if (i === 0) {
                    return true;
                }

                return user.registeredDate! <= users[i - 1].registeredDate!;
            });
            expect(checkDesc).to.be.true;
        });

        it('get users by sport with empty params', async () => {
            const {data: [sport]} = await getAllSports();
            const {status} = await getUsersBySport(sport.id!, {});
            expect(status).to.equal(400);
        });
    });

    describe('Update', () => {
        // Remove link of user-sport
        it('delete', async () => {
            const {data: [sport]} = await getAllSports();
            const {data: [deletedUser]} = await getUsersBySport(sport.id!, {limit: 10, skip: 0});
            await deleteUserSportLink(deletedUser.id!, sport.id!);

            const {data: users} = await getUsersBySport(sport.id!, {limit: 10, skip: 0});
            const checkUser = users.find((user) => deletedUser.id === user.id);
            expect(checkUser).to.be.not.ok;
        });

        // Add link of user-sport
        it('add', async () => {
            const {data: [sport]} = await getAllSports();
            const userData = await generateUser();
            const {data: [newUser]} = await insertUser(userData);
            await insertUserSportLink(newUser.id!, sport.id!);
            const {data: users} = await getUsersBySport(sport.id!, {limit: 100, skip: 0});

            const checkUser = users.find((user) => newUser.id === user.id);
            expect(checkUser!.id).to.equal(newUser.id);
        });
    });
});
