import {expect, assert} from 'chai';
import pMap from 'p-map';

import {IUserModel, REQUIRED_FIELDS, NOT_UPDATED_FIELDS} from 'src/models/user';
import {checkAssertion, checkOrder} from 'tests/utils';
import {USER_RETURNING_FIELDS} from 'src/query-creators/user';
import {translatePostgresqlNameToNode} from 'src/utils/db/helper';
import {checkRequiredFields, removeNotUpdatedFields} from 'src/utils';
import {generateUser, dbActions as userDbActions} from 'tests/helpers/user';
import {dbActions as countryDbActions} from 'tests/helpers/country';
import {dbActions as sportDbActions} from 'tests/helpers/sport';
import {dbActions as exerciseTemplateDbActions} from 'tests/helpers/exercise-template';
import {dbActions as exerciseDbActions} from 'tests/helpers/exercise';

const {getAllCountries} = countryDbActions;
const {
    insertUser,
    updateUser,
    getUserById,
    getUserByLogin,
    checkUserPassword,
    getUsers,
    deleteUserById
} = userDbActions;
const {getUserSports} = sportDbActions;
const {getUserExerciseTemplates, deleteExerciseTemplate} = exerciseTemplateDbActions;
const {getUserExercises, deleteExercise} = exerciseDbActions;

const LIMIT_PARAMS = {limit: 100, skip: 0};
const NONEXISTENT_ID = '9607957f-9f02-4e55-bd36-8961dba1f694';

const deleteUserExercisesAndTemplates = async (user: IUserModel) => {
    const {data: exerciseTemplates} = await getUserExerciseTemplates({
        userId: user.id,
        limitParams: LIMIT_PARAMS
    });

    await pMap(exerciseTemplates, async (template) => {
        const {data: exercises} = await getUserExercises({
            templateId: template.id,
            userId: user.id,
            limitParams: LIMIT_PARAMS
        });

        await pMap(exercises, async (exercise) => {
            await deleteExercise(exercise.id!);
        }, {concurrency: 1});

        await deleteExerciseTemplate(template.id!);
    }, {concurrency: 1});
};

describe('User:', (): void => {
    describe('Create user', () => {
        it('simple', async () => {
            const {data: [country]} = await getAllCountries();
            const newUser = generateUser({countryId: country.id});
            const {data: [insertedUser], status} = await insertUser(newUser);

            // password mustn't return after user was created
            expect(insertedUser.password).to.be.not.ok;
            // default values
            expect(insertedUser.isAthlete).to.be.false;
            expect(insertedUser.isBanned).to.be.false;
            newUser.isAthlete = insertedUser.isAthlete;
            newUser.isBanned = insertedUser.isBanned;

            // add for correct check
            insertedUser.password = newUser.password;
            newUser.id = insertedUser.id;
            newUser.registeredDate = insertedUser.registeredDate;
            // check the availability of id & registeredDate
            expect(insertedUser.id).to.be.ok;
            expect(insertedUser.registeredDate).to.be.ok;
            expect(insertedUser).to.deep.equal(newUser);
            expect(status).to.equal(200);
        });

        it('with not existing country id', async () => {
            const {data: countries} = await getAllCountries();
            const newUser = generateUser({countryId: countries![countries!.length - 1].id + 1});
            const {error: {message}, status} = await insertUser(newUser);

            expect(message.includes('users_country_id_fkey')).to.be.true;
            expect(status).to.equal(409);
        });

        it('with empty country id', async () => {
            const newUser = generateUser();
            const {data: [insertedUser], status} = await insertUser(newUser);

            expect(insertedUser.countryId).to.be.not.ok;
            expect(status).to.equal(200);
        });

        it('with same email', async () => {
            const {data: [user]} = await getUsers(LIMIT_PARAMS);
            const newUser = generateUser();
            newUser.email = user.email;

            const {error: {message}, status} = await insertUser(newUser);

            expect(message.includes('users_email_key')).to.be.true;
            expect(status).to.equal(409);
        });

        it('with same login', async () => {
            const {data: [user]} = await getUsers(LIMIT_PARAMS);
            const newUser = generateUser();
            newUser.login = user.login;

            const {error: {message}, status} = await insertUser(newUser);

            expect(message.includes('users_login_key')).to.be.true;
            expect(status).to.equal(409);
        });

        it('without required fields', async () => {
            await Promise.all(REQUIRED_FIELDS.map(async (field) => {
                const newUser = generateUser();
                delete newUser[field];

                const {error: {message}, status} = await insertUser(newUser);

                expect(message).to.equal(`"${field}" is required`);
                expect(status).to.equal(400);
            }));
        });
    });

    describe('Update user', () => {
        it('simple', async () => {
            const {data: [country]} = await getAllCountries();
            const newUser = generateUser({
                isAthlete: true,
                isBanned: true,
                countryId: country.id
            });

            const {data: [user]} = await getUsers(LIMIT_PARAMS);
            const updatedFields = removeNotUpdatedFields(Object.keys(user), NOT_UPDATED_FIELDS) as (keyof IUserModel)[];

            await pMap(updatedFields, async (field) => {
                const {data: [user]} = await getUsers(LIMIT_PARAMS);
                const {data: [updatedUser]} = await updateUser(user.id!, {[field]: newUser[field]});
                const {data: [checkUser]} = await getUserById(user.id!);
                checkUser.password = updatedUser.password;

                assert(
                    checkAssertion(checkUser[field], newUser[field]),
                    `${field}: ${checkUser[field]} != ${newUser[field]}`
                );
            }, {concurrency: 1});
        });

        it('with not updated fields and some updated field', async () => {
            await pMap(NOT_UPDATED_FIELDS, async (field) => {
                const newUser = generateUser();
                const {data: [user]} = await getUsers(LIMIT_PARAMS);

                await updateUser(user.id!, {
                    [field]: newUser[field],
                    // if send only not_updated_field => server remove it
                    // and send empty query => will be error 409 (next test)
                    selfInfo: newUser.selfInfo
                });
                const {data: [checkUser]} = await getUserById(user.id!);

                assert(
                    checkAssertion(checkUser[field], user[field]),
                    `${checkUser[field]} != ${user[field]}`
                );
                expect(checkUser.selfInfo).to.equal(newUser.selfInfo);
            }, {concurrency: 1});
        });

        it('with only not updated fields', async () => {
            await Promise.all(NOT_UPDATED_FIELDS.map(async (field) => {
                const newUser = generateUser();
                const {data: [user]} = await getUsers(LIMIT_PARAMS);

                const {status} = await updateUser(user.id!, {[field]: newUser[field]});
                expect(status).to.equal(409);
            }));
        });

        it('with nonexistent id', async () => {
            const {data, status} = await updateUser(NONEXISTENT_ID, {name: 'name'});
            expect(data).to.be.empty;
            expect(status).to.equal(200);
        });
    });

    describe('Get users', () => {
        it('many', async () => {
            const {data: users} = await getUsers(Object.assign({}, LIMIT_PARAMS, {limit: 3}));
            expect(users.length).to.equal(3);

            const userReturningFields = USER_RETURNING_FIELDS.map(translatePostgresqlNameToNode);

            const [user] = users;
            expect(checkRequiredFields(userReturningFields, user)).to.be.true;
        });

        it('without limit params', async () => {
            const {status} = await getUsers({});
            expect(status).to.equal(400);
        });

        it('with default order param = ASC', async () => {
            const {data: users, status} = await getUsers(LIMIT_PARAMS);
            const checkAsc = checkOrder(users, 'ASC', (user) => user.registeredDate);
            expect(checkAsc).to.be.true;
            expect(status).to.equal(200);
        });

        it('with order param = DESC', async () => {
            const {data: users, status} = await getUsers(Object.assign({}, LIMIT_PARAMS, {order: 'DESC'}));
            const checkDesc = checkOrder(users, 'DESC', (user) => user.registeredDate);
            expect(checkDesc).to.be.true;
            expect(status).to.equal(200);
        });

        it('with offset param', async () => {
            const {data: users1} = await getUsers(Object.assign({}, LIMIT_PARAMS, {skip: 1}));
            const {data: users2} = await getUsers(Object.assign({}, LIMIT_PARAMS, {skip: 2}));

            expect(users1[2]).to.deep.equal(users2[1]);
        });
    });

    describe('Get user', () => {
        it('by id', async () => {
            const {data: [checkUser]} = await getUsers(LIMIT_PARAMS);
            const {data: [user]} = await getUserById(checkUser.id!);
            expect(user).to.deep.equal(checkUser);
        });

        it('by login (strict)', async () => {
            const {data: [checkUser]} = await getUsers(Object.assign({}, LIMIT_PARAMS, {order: 'DESC'}));
            const {data: [user]} = await getUserByLogin(checkUser.login!);
            expect(user).to.deep.equal(checkUser);
        });

        it('by login (not strict)', async () => {
            const STRICT_LENGTH_OF_RETURNING = 10; // in code write const
            const {data: users, status} = await getUserByLogin('.', false);
            expect(users.length > 0 && users.length <= STRICT_LENGTH_OF_RETURNING).to.be.true;
            expect(status).to.equal(200);
        });
    });

    describe('Check user', () => {
        it('password', async () => {
            const newUser = generateUser();
            const {data: [user]} = await insertUser(newUser);
            const {data: users} = await checkUserPassword(newUser.login!, newUser.password!);

            expect(users.length === 1).to.be.true;
            expect(user.id).to.deep.equal(users[0].id);
        });
    });

    describe('Delete user', () => {
        it('by id', async () => {
            const {data: [user]} = await getUsers(LIMIT_PARAMS);
            const {error: {message}, status} = await deleteUserById(user.id!);
            expect(status).to.equal(409);
            expect(message.includes('foreign key constraint "exercise_template_user_id_fkey"')).to.be.true;

            await deleteUserExercisesAndTemplates(user);

            const {data: [deletedUser], status: deletedStatus} = await deleteUserById(user.id!);
            expect(deletedStatus).to.equal(200);
            expect(deletedUser).to.deep.equal(user);
            const {data: users} = await getUserById(user.id!);
            expect(users.length === 0).to.be.true;
        });

        it('cascade user-sport link', async () => {
            const {data: [user]} = await getUsers(LIMIT_PARAMS);
            await deleteUserExercisesAndTemplates(user);

            const {data: sports} = await getUserSports(user.id!);
            expect(sports.length > 0).to.be.true;

            const {data: [deletedUser]} = await deleteUserById(user.id!);
            expect(user).to.deep.equal(deletedUser);

            const {data: deletedSports} = await getUserSports(user.id!);
            expect(deletedSports.length === 0).to.be.true;
        });
    });
});
