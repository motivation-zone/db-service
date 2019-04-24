import {readFileSync} from 'fs';
import {exec} from 'child_process';
import pMap from 'p-map';

import {dbActions as userDbActions, generateUser} from 'tests/helpers/user';
import {dbActions as sportDbActions} from 'tests/helpers/sport';
import {dbActions as countryDbActions} from 'tests/helpers/country';
import {dbActions as difficultyLevelDbActions} from 'tests/helpers/difficulty-level';
import {
    dbActions as exerciseTemplateDbActions, generateExerciseTemplate
} from 'tests/helpers/exercise-template';
import {dbActions as exerciseDbActions, generateExercise} from 'tests/helpers/exercise';
import {
    CREATED_USERS_COUNT,
    EXERCISE_TEMPLATES_PER_USER_COUNT,
    EXERCISE_PER_TEMPLATE_COUNT,
    SPORTS_COUNT
} from 'tests/fill/const';

import {query} from 'src/lib/db/client';
import {getAbsolutePath} from 'src/utils/fs';
import {intervalRandom} from 'src/utils';
import {IExerciseModel} from 'src/models/exercise';
import LinkUserSportModel, {ILinkUserSportModel} from 'src/models/link/user-sport';
import {IExerciseTemplateModel} from 'src/models/exercise-template';
import consoleLogger from 'src/lib/logger/console-logger';
import ProgressBar from 'src/lib/logger/progress-bar';

const {getAllCountries} = countryDbActions;
const {getAllSports, insertUserSportLink} = sportDbActions;
const {insertUser} = userDbActions;
const {insertExerciseTemplate} = exerciseTemplateDbActions;
const {insertExercise} = exerciseDbActions;
const {getAllDifficultyLevels} = difficultyLevelDbActions;

const bar = new ProgressBar();
const barTotal = CREATED_USERS_COUNT +
    CREATED_USERS_COUNT * EXERCISE_TEMPLATES_PER_USER_COUNT +
    CREATED_USERS_COUNT * EXERCISE_TEMPLATES_PER_USER_COUNT * EXERCISE_PER_TEMPLATE_COUNT +
    SPORTS_COUNT * CREATED_USERS_COUNT;
let barCurrent = 0;
const barUpdate = (diff: number, action: string) => {
    barCurrent += diff;
    bar.update(barCurrent, action);
};

const log = (msg: any) => {
    if (!msg) {
        return;
    }

    if (msg instanceof Error) {
        return consoleLogger.error(`Name: ${msg.message}\n${msg.stack}`);
    }

    consoleLogger.info(JSON.stringify(msg));
};

const concatMigrations = async () => {
    barUpdate(0, 'Concat migration');
    await new Promise((resolve, reject) => {
        exec('make tools-migration-concat', (err) => {
            if (err) {
                reject(err);
            }

            resolve();
        });
    });
};

const reloadPublicSchema = async () => {
    barUpdate(0, 'Reload public schema');
    await query({
        text: 'DROP SCHEMA public CASCADE; CREATE SCHEMA public;',
        values: []
    });
};

const createTables = async () => {
    barUpdate(0, 'Create tables');
    const resultFile = readFileSync(getAbsolutePath('./migration/result.pgsql')).toString();
    await query({
        text: resultFile,
        values: []
    });
};

const clearDatabase = async () => {
    try {
        await reloadPublicSchema();
        await concatMigrations();
        await createTables();
    } catch (err) {
        log(err);
    }
};

const CONCURRENCY = 5;

const run = async () => {
    bar.start(barTotal);
    await clearDatabase();

    const countsArray: boolean[] = [
        ...new Array(CREATED_USERS_COUNT / 2).fill(true),
        ...new Array(CREATED_USERS_COUNT / 2).fill(false)
    ];

    const {data: countries, error: countriesError} = await getAllCountries();
    log(countriesError);
    const {data: sports, error: sportsError} = await getAllSports();
    log(sportsError);
    const {data: difficultyLevels, error: difficultyLevelsError} = await getAllDifficultyLevels();
    log(difficultyLevelsError);

    // User
    const usersRow = await pMap(countsArray, async (isCountryExist) => {
        const countryId = intervalRandom(countries[0].id, countries[countries.length - 1].id);
        const newUser = generateUser({countryId: isCountryExist ? countryId : undefined});
        const {data: users, error} = await insertUser(newUser);
        log(error);

        barUpdate(1, 'Create users');
        return users && users[0];
    }, {concurrency: CONCURRENCY});
    const users = usersRow.filter(Boolean);

    // Link user-sport
    const linkUserSportNotFlatten = await pMap(users, async (user) => {
        return await pMap(sports, async (sport) => {
            const link = new LinkUserSportModel({userId: user!.id, sportId: sport.id});
            const {data: userSportLinks, error} = await insertUserSportLink(link);
            log(error);
            barUpdate(1, 'Create links between sport and user');
            return userSportLinks && userSportLinks[0];
        }, {concurrency: CONCURRENCY});
    }, {concurrency: 1});
    const linkUserSport: ILinkUserSportModel[] = // tslint:disable-line
        [].concat.apply([], linkUserSportNotFlatten as any).filter(Boolean);

    // Exercise-template
    const exerciseTemplatesNotFlatten = await pMap(users, async (user) => {
        return await pMap(new Array(EXERCISE_TEMPLATES_PER_USER_COUNT).fill(true), async () => {
            const sportId = intervalRandom(sports[0].id!, sports[sports.length - 1].id!);
            const difficultyLevelId = intervalRandom(
                difficultyLevels[0].id,
                difficultyLevels[difficultyLevels.length - 1].id
            );
            const newTemplate = generateExerciseTemplate({
                userId: user!.id!,
                sportId,
                difficultyLevelId
            });
            const {data: templates, error} = await insertExerciseTemplate(newTemplate);
            log(error);

            barUpdate(1, 'Create exercise templates');
            return templates && templates[0];
        }, {concurrency: CONCURRENCY});
    }, {concurrency: 1});
    const exerciseTemplates: IExerciseTemplateModel[] = []
        .concat.apply([], exerciseTemplatesNotFlatten as any)
        .filter(Boolean);

    // Exercise
    const exercisesNotFlatten = await pMap(exerciseTemplates, async (template) => {
        return await pMap(new Array(EXERCISE_PER_TEMPLATE_COUNT).fill(true), async () => {
            const newExercise = generateExercise(template.id!);
            const {data: exercises, error} = await insertExercise(newExercise);
            log(error);

            barUpdate(1, 'Create exercises');
            return exercises && exercises[0];
        }, {concurrency: CONCURRENCY});
    }, {concurrency: 1});
    const exercises: IExerciseModel[] =[] // tslint:disable-line
        .concat.apply([], exercisesNotFlatten as any)
        .filter(Boolean);

    bar.stop();
};

(async () => {
    try {
        await run();
    } catch (error) {
        log(error);
    } finally {
        process.exit();
    }
})();
