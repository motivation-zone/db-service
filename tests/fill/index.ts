import {readFileSync} from 'fs';
import {exec} from 'child_process';
import pMap from 'p-map';
import cliProgress from 'cli-progress';

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
} from 'tests/const';

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
const {getAllDifficultyLevels} = difficultyLevelDbActions;

const log = (msg: string) => logger('tests', 'app', msg);

const bar = new cliProgress.Bar({
    format: '[{bar}] {percentage}% | ETA: {eta}s | {value}/{total} | Action: {action}'
}, cliProgress.Presets.shades_classic);

const barTotal = CREATED_USERS_COUNT +
    CREATED_USERS_COUNT * EXERCISE_TEMPLATES_PER_USER_COUNT +
    CREATED_USERS_COUNT * EXERCISE_TEMPLATES_PER_USER_COUNT * EXERCISE_PER_TEMPLATE_COUNT +
    SPORTS_COUNT * CREATED_USERS_COUNT;
let barCurrent = 0;
const barUpdate = (diff: number, options: any) => {
    barCurrent += diff;
    bar.update(barCurrent, options);
};

const writeError = (err: any) => {
    if (!(err instanceof Error)) {
        err = JSON.stringify(err);
    }
    console.log(`\nERROR=${err}, ${err.stack}`); // tslint:disable-line
};

const concatMigrations = async () => {
    barUpdate(0, {
        action: 'Concat migration'
    });
    await new Promise((resolve, reject) => {
        const concatFile = getAbsolutePath('./tools/database/pgsql-concat.js');
        exec(`node ${concatFile}`, (err) => {
            if (err) {
                reject(err);
            }

            resolve();
        });
    });
};

const reloadPublicSchema = async () => {
    if (process.env.IS_REMOTE === 'true') {
        return;
    }

    barUpdate(0, {
        action: 'Reload public schema'
    });
    await query({
        text: 'DROP SCHEMA public CASCADE; CREATE SCHEMA public;',
        values: []
    });
};

const createTables = async () => {
    barUpdate(0, {
        action: 'Create tables'
    });
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

const run = async () => {
    bar.start(barTotal, barCurrent);
    await clearDatabase();

    const countsArray: boolean[] = [
        ...new Array(CREATED_USERS_COUNT / 2).fill(true),
        ...new Array(CREATED_USERS_COUNT / 2).fill(false)
    ];

    const {data: countries} = await getAllCountries();
    const {data: sports} = await getAllSports();
    const {data: difficultyLevels} = await getAllDifficultyLevels();

    // User
    const users = await pMap(countsArray, async (isCountryExist) => {
        const countryId = intervalRandom(countries[0].id, countries[countries.length - 1].id);
        const newUser = generateUser({countryId: isCountryExist ? countryId : undefined});
        const {data: users, error} = await insertUser(newUser);
        if (error) {
            writeError(error);
        }

        barUpdate(1, {action: 'Create users'});
        return users[0];
    }, {concurrency: 1});

    // Link user-sport
    const linkUserSportNotFlatten = await pMap(users, async (user) => {
        return await pMap(sports, async (sport) => {
            const link = new LinkUserSportModel({userId: user.id, sportId: sport.id});
            const {data: userSportLinks, error} = await insertUserSportLink(link);
            if (error) {
                writeError(error);
            }

            barUpdate(1, {action: 'Create links between sport and user'});
            return userSportLinks[0];
        }, {concurrency: 1});
    }, {concurrency: 1});
    const linkUserSport: ILinkUserSportModel[] = [].concat.apply([], linkUserSportNotFlatten as any); // tslint:disable-line

    // Exercise-template
    const exerciseTemplatesNotFlatten = await pMap(users, async (user) => {
        return await pMap(new Array(EXERCISE_TEMPLATES_PER_USER_COUNT).fill(true), async () => {
            const sportId = intervalRandom(sports[0].id!, sports[sports.length - 1].id!);
            const difficultyLevelId = intervalRandom(
                difficultyLevels[0].id,
                difficultyLevels[difficultyLevels.length - 1].id
            );
            const newTemplate = generateExerciseTemplate({
                userId: user.id!,
                sportId,
                difficultyLevelId
            });
            const {data: templates, error} = await insertExerciseTemplate(newTemplate);
            if (error) {
                writeError(error);
            }

            barUpdate(1, {action: 'Create exercise templates'});
            return templates && templates[0];
        }, {concurrency: 1});
    }, {concurrency: 1});
    const exerciseTemplates: IExerciseTemplateModel[] = []
        .concat.apply([], exerciseTemplatesNotFlatten as any)
        .filter(Boolean);

    // Exercise
    const exercisesNotFlatten = await pMap(exerciseTemplates, async (template) => {
        return await pMap(new Array(EXERCISE_PER_TEMPLATE_COUNT).fill(true), async () => {
            const newExercise = generateExercise(template.id!);
            const {data: exercises, error} = await insertExercise(newExercise);
            if (error) {
                writeError(error);
            }

            barUpdate(1, {action: 'Create exercises'});
            return exercises && exercises[0];
        }, {concurrency: 1});
    }, {concurrency: 1});
    const exercises: IExerciseModel[] = [].concat.apply([], exercisesNotFlatten as any).filter(Boolean);  // tslint:disable-line

    bar.stop();
};

(async () => {
    try {
        await run();
    } catch (e) {
        writeError(e);
    } finally {
        process.exit();
    }
})();
