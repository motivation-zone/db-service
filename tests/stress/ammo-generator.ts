import fs from 'fs';

import {getAbsolutePath} from 'src/utils/fs';
import {apiUrls} from 'src/urls';
import {intervalRandom, formQueryString} from 'src/utils';
import {IExerciseTemplateModel} from 'src/models/exercise-template';

import {dbActions as userDbActions} from 'tests/helpers/user';
import {dbActions as sportDbActions} from 'tests/helpers/sport';
import {dbActions as countryDbActions} from 'tests/helpers/country';
import {dbActions as exerciseTemplateDbActions} from 'tests/helpers/exercise-template';
import {dbActions as exerciseDbActions} from 'tests/helpers/exercise';
import {dbActions as difficultyLevelDbActions} from 'tests/helpers/difficulty-level';
import {
    CREATED_USERS_COUNT,
    EXERCISE_TEMPLATES_PER_USER_COUNT,
    EXERCISE_PER_TEMPLATE_COUNT
} from 'tests/const';

const {getUsers} = userDbActions;
const {getAllSports} = sportDbActions;
const {getAllCountries} = countryDbActions;
const {getAllDifficultyLevels} = difficultyLevelDbActions;
const {getUserExerciseTemplates} = exerciseTemplateDbActions;
const {getUserExercises} = exerciseDbActions;

const AMMO_FILE_PATH = getAbsolutePath('./tests/stress/ammo.txt');

try {
    fs.unlinkSync(AMMO_FILE_PATH);
} catch (e) {}

const generateUserSelect = async (): Promise<string[]> => {
    const result: string[] = [];
    const urls = apiUrls.user;
    const {data: users} = await getUsers({limit: CREATED_USERS_COUNT, skip: 0});

    new Array(20).fill(true).forEach(() => {
        result.push(`${urls.prefix}${urls.getUsers}?${formQueryString({
            limit: intervalRandom(Math.floor(CREATED_USERS_COUNT / 2), CREATED_USERS_COUNT),
            skip: intervalRandom(0, Math.round(CREATED_USERS_COUNT / 2)),
            order: Math.random() > 0.5 ? 'ASC' : 'DESC'
        })}`);

        const userId = users[intervalRandom(0, users.length - 1)].id!;
        result.push(`${urls.prefix}${urls.getUserById.replace(':userId', userId)}`);

        const userLoginRow = users[intervalRandom(0, users.length - 1)].login!;
        const userLogin = Math.random() > 0.5 ?
            userLoginRow.slice(0, intervalRandom(1, userLoginRow.length - 1)) :
            userLoginRow;
        result.push(`${urls.prefix}/${urls.getUserByLogin.replace(':login', userLogin)}?` +
            `${Math.random() > 0.5 ? `strict=true` : ''}`
        );
    });

    return result;
};

const generateSportSelect = async (): Promise<string[]> => {
    const result: string[] = [];
    const {data: sports} = await getAllSports();
    const {data: users} = await getUsers({limit: CREATED_USERS_COUNT, skip: 0});
    const urls = apiUrls.sport;

    result.push(`${urls.prefix}${urls.getSports}`);

    new Array(20).fill(true).forEach(() => {
        const sportId = sports[intervalRandom(0, sports.length - 1)].id!;
        result.push(`${urls.prefix}${urls.getUsersBySport.replace(':sportId', String(sportId))}?` +
            `${formQueryString({
                limit: intervalRandom(Math.floor(CREATED_USERS_COUNT / 2), CREATED_USERS_COUNT),
                skip: intervalRandom(0, Math.round(CREATED_USERS_COUNT / 2)),
                order: Math.random() > 0.5 ? 'ASC' : 'DESC'
            })}`
        );

        const userId = users[intervalRandom(0, users.length - 1)].id!;
        result.push(`${urls.prefix}${urls.getUserSports.replace(':userId', userId)}`);
    });

    return result;
};

const generateCountrySelect = async (): Promise<string[]> => {
    const result: string[] = [];
    const {data: countries} = await getAllCountries();
    const urls = apiUrls.country;

    result.push(`${urls.prefix}${urls.getCountries}`);

    new Array(20).fill(true).forEach(() => {
        const countryId = countries[intervalRandom(0, countries.length - 1)].id!;
        result.push(`${urls.prefix}${urls.getUsersByCountry.replace(':countryId', String(countryId))}?` +
            `${formQueryString({
                limit: intervalRandom(Math.floor(CREATED_USERS_COUNT / 2), CREATED_USERS_COUNT),
                skip: intervalRandom(0, Math.round(CREATED_USERS_COUNT / 2)),
                order: Math.random() > 0.5 ? 'ASC' : 'DESC'
            })}`
        );
    });

    return result;
};

const getExerciseTemplates = async (params: {
    userId: string; sportId: number; difficultyLevelId: number
}): Promise<{url: string; exerciseTemplates: IExerciseTemplateModel[]} | null> => {
    const {userId, sportId, difficultyLevelId} = params;
    const urls = apiUrls.exerciseTemplate;
    const exerciseTemplatesQuery = {
        userId,
        sportId,
        difficultyLevelId,
        limitParams: {
            limit: intervalRandom(
                Math.floor(EXERCISE_TEMPLATES_PER_USER_COUNT / 2),
                EXERCISE_TEMPLATES_PER_USER_COUNT
            ),
            skip: intervalRandom(0, Math.round(EXERCISE_TEMPLATES_PER_USER_COUNT / 2)),
            order: Math.random() > 0.5 ? 'ASC' : 'DESC'
        }
    };
    const {data: exerciseTemplates} = await getUserExerciseTemplates(exerciseTemplatesQuery);
    if (exerciseTemplates.length === 0) {
        return null;
    }

    const url = `${urls.prefix}${urls.getUserExerciseTemplates.replace(':userId', userId!)}?` +
        `${formQueryString({
            ...exerciseTemplatesQuery.limitParams,
            sportId: exerciseTemplatesQuery.sportId,
            userId: exerciseTemplatesQuery.userId,
            difficultyLevelId: exerciseTemplatesQuery.difficultyLevelId
        })}`;

    return {
        url,
        exerciseTemplates
    };
};

const generateExerciseTemplateSelect = async (): Promise<string[]> => {
    const result: string[] = [];
    const urls = apiUrls.exerciseTemplate;

    const {data: users} = await getUsers({limit: CREATED_USERS_COUNT, skip: 0});
    const {data: sports} = await getAllSports();
    const {data: difficultyLevel} = await getAllDifficultyLevels();

    await Promise.all(new Array(100).fill(true).map(async () => {
        const userId = users[intervalRandom(0, users.length - 1)].id!;
        const sportId = sports[intervalRandom(0, sports.length - 1)].id!;
        const difficultyLevelId = difficultyLevel[intervalRandom(0, difficultyLevel.length - 1)].id!;

        const exerciseTemplatesData = await getExerciseTemplates({
            userId, sportId, difficultyLevelId
        });

        if (!exerciseTemplatesData) {
            return;
        }

        const {url, exerciseTemplates} = exerciseTemplatesData;
        result.push(url);

        new Array(2).fill(true).forEach(() => {
            const templateId = exerciseTemplates[intervalRandom(0, exerciseTemplates.length - 1)].id!;
            result.push(`${urls.prefix}${urls.getExerciseTemplateById}`.replace(':templateId', templateId));
        });
    }));

    return result;
};

const generateExerciseSelect = async (): Promise<string[]> => {
    const result: string[] = [];
    const urls = apiUrls.exercise;

    const {data: users} = await getUsers({limit: 10000, skip: 0});
    const {data: sports} = await getAllSports();
    const {data: difficultyLevel} = await getAllDifficultyLevels();

    await Promise.all(new Array(100).fill(true).map(async () => {
        const userId = users[intervalRandom(0, users.length - 1)].id!;
        const sportId = sports[intervalRandom(0, sports.length - 1)].id!;
        const difficultyLevelId = difficultyLevel[intervalRandom(0, difficultyLevel.length - 1)].id!;

        const exerciseTemplatesData = await getExerciseTemplates({
            userId, sportId, difficultyLevelId
        });

        if (!exerciseTemplatesData) {
            return;
        }

        const {exerciseTemplates} = exerciseTemplatesData;
        if (exerciseTemplates.length === 0) {
            return;
        }

        const exercisesCount = EXERCISE_PER_TEMPLATE_COUNT * EXERCISE_TEMPLATES_PER_USER_COUNT;
        const templateId = exerciseTemplates[intervalRandom(0, exerciseTemplates.length - 1)].id!;
        const exercisesQuery = {
            limitParams: {
                limit: intervalRandom(Math.floor(exercisesCount / 2), exercisesCount),
                skip: intervalRandom(0, Math.round(exercisesCount / 2)),
                order: Math.random() > 0.5 ? 'ASC' : 'DESC'
            },
            sportId,
            difficultyLevelId,
            templateId,
            userId
        };
        const {data: exercises} = await getUserExercises(exercisesQuery);
        if (exercises.length === 0) {
            return;
        }

        result.push(`${urls.prefix}${urls.getUserExercises.replace(':userId', userId!)}?` +
            `${formQueryString({
                ...exercisesQuery.limitParams,
                sportId: exercisesQuery.sportId,
                difficultyLevelId: exercisesQuery.difficultyLevelId,
                templateId: exercisesQuery.templateId
            })}`
        );

        new Array(2).fill(true).forEach(() => {
            const exerciseId = exercises[intervalRandom(0, exercises.length - 1)].id!;
            result.push(`${urls.prefix}${urls.getExerciseById.replace(':exerciseId', exerciseId)}`);
        });
    }));

    return result;
};

(async () => {
    try {
        fs.appendFileSync(AMMO_FILE_PATH, [
            '[Connection: close]',
            '[Host: 127.0.0.1:5000]',
            `[Authorization: ${process.env.MZ_DB_SERVICE_TOKEN}]`,
            ...await generateUserSelect(),
            ...await generateSportSelect(),
            ...await generateCountrySelect(),
            ...await generateExerciseTemplateSelect(),
            ...await generateExerciseSelect()
        ].join('\n'));

        console.log('\x1b[32m%s\x1b[0m', 'Successfully generated'); // tslint:disable-line
    } catch (err) {
        console.log(err); // tslint:disable-line
    } finally {
        process.exit();
    }
})();
