import {readFileSync} from 'fs';
import {exec} from 'child_process';
import pMap from 'p-map';

import {dbActions as userDbActions, generateUser} from 'tests/helpers/user';
import {dbActions as sportDbActions} from 'tests/helpers/sport';
import {dbActions as countryDbActions} from 'tests/helpers/country';
import {
    dbActions as exerciseTemplateDbActions, generateExerciseTemplate
} from 'tests/helpers/exercise-template';
import {dbActions as exerciseDbActions, generateExercise} from 'tests/helpers/exercise';
import {CREATED_USERS_COUNT} from 'tests/const';

import {query} from 'src/lib/db/client';
import logger from 'src/lib/logger';
import {getAbsolutePath} from 'src/utils/fs';
import {intervalRandom} from 'src/utils';
import {IExerciseModel} from 'src/models/exercise';
import LinkUserSportModel, {ILinkUserSportModel} from 'src/models/link/user-sport';
import {IExerciseTemplateModel} from 'src/models/exercise-template';

const {getAllCountries} = countryDbActions;
const {getAllSports, insertUserSportLink} = sportDbActions;
const {insertUser} = userDbActions;
const {insertExerciseTemplate} = exerciseTemplateDbActions;
const {insertExercise} = exerciseDbActions;

const log = (msg: string) => logger('tests', 'app', msg);

const concatMigrations = async () => {
    await new Promise((resolve, reject) => {
        const concatFile = getAbsolutePath('./migration/concat.js');
        exec(`node ${concatFile}`, (err) => {
            if (err) {
                reject(err);
            }

            resolve();
        });
    });
};

const reloadPublicSchema = async () => {
    await query({
        text: 'DROP SCHEMA public CASCADE; CREATE SCHEMA public;',
        values: []
    });
};

const createTables = async () => {
    const resultFile = readFileSync(getAbsolutePath('./migration/result.pgsql')).toString();
    await query({
        text: resultFile,
        values: []
    });
};

const clearDatabase = async () => {
    await reloadPublicSchema();
    await concatMigrations();
    await createTables();
};

(async () => {
    await clearDatabase();

    const countsArray: boolean[] = [
        ...new Array(CREATED_USERS_COUNT / 2).fill(true),
        ...new Array(CREATED_USERS_COUNT / 2).fill(false)
    ];

    const {data: countries} = await getAllCountries();
    log(`Countries: ${countries.length}`);
    const {data: sports} = await getAllSports();
    log(`Sports: ${sports.length}`);

    // User
    const users = await pMap(countsArray, async (isCountryExist) => {
        const countryId = intervalRandom(countries[0].id, countries[countries.length - 1].id);
        const newUser = generateUser({countryId: isCountryExist ? countryId : undefined});
        const {data: [user]} = await insertUser(newUser);
        return user;
    }, {concurrency: 2});
    log(`Users: ${users.length}`);

    // Link user-sport
    const linkUserSportNotFlatten = await pMap(users, async (user) => {
        return await pMap(sports, async (sport) => {
            const link = new LinkUserSportModel({userId: user.id, sportId: sport.id});
            const {data: [userSportLink]} = await insertUserSportLink(link);
            return userSportLink;
        }, {concurrency: 2});
    }, {concurrency: 2});
    const linkUserSport: ILinkUserSportModel[] = [].concat.apply([], linkUserSportNotFlatten as any);
    log(`Links user-sport: ${linkUserSport.length}`);

    // Exercise-template
    const exerciseTemplatesNotFlatten = await pMap(users, async (user) => {
        return await pMap(new Array(intervalRandom(2, 5)).fill(true), async () => {
            const sportId = intervalRandom(sports[0].id!, sports[sports.length - 1].id!);
            const newTemplate = generateExerciseTemplate(user.id!, sportId);
            const {data: [template]} = await insertExerciseTemplate(newTemplate);
            return template;
        }, {concurrency: 1});
    }, {concurrency: 1});
    const exerciseTemplates: IExerciseTemplateModel[] = [].concat.apply([], exerciseTemplatesNotFlatten as any);
    log(`Exercise templates: ${exerciseTemplates.length}`);

    // Exercise
    const exercisesNotFlatten = await pMap(exerciseTemplates, async (template) => {
        return await pMap(new Array(intervalRandom(2, 5)).fill(true), async () => {
            const newExercise = generateExercise(template.id!);
            const {data: [exercise]} = await insertExercise(newExercise);
            return exercise;
        }, {concurrency: 1});
    }, {concurrency: 1});
    const exercises: IExerciseModel[] = [].concat.apply([], exercisesNotFlatten as any);
    log(`Exercises: ${exercises.length}`);

    process.exit();
})();
