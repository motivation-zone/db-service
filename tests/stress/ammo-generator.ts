import fs from 'fs';

import {getAbsolutePath} from 'src/utils/fs';
import {apiUrls} from 'src/urls';
import {intervalRandom, formQueryString} from 'src/utils';

import {dbActions as userDbActions} from 'tests/helpers/user';
import {dbActions as sportDbActions} from 'tests/helpers/sport';
import {dbActions as countryDbActions} from 'tests/helpers/country';
import {dbActions as exerciseTemplateDbActions} from 'tests/helpers/exercise-template';
import {dbActions as exerciseDbActions} from 'tests/helpers/exercise';

const {getUsers} = userDbActions;
const {getAllSports} = sportDbActions;
const {getAllCountries} = countryDbActions;
const {getExerciseTemplate, getUserExerciseTemplates} = exerciseTemplateDbActions; // tslint:disable-line
const {getExercise, getUserExercises} = exerciseDbActions; // tslint:disable-line

const AMMO_FILE_PATH = getAbsolutePath('./tests/stress/ammo.txt');

try {
    fs.unlinkSync(AMMO_FILE_PATH);
} catch (e) {}

const generateUserSelect = async (): Promise<string[]> => {
    const result: string[] = [];
    const urls = apiUrls.user;
    const {data: users} = await getUsers({limit: 10000, skip: 0});

    new Array(10).fill(true).forEach(() => {
        result.push(`${urls.prefix}${urls.getUsers}?${formQueryString({
            limit: intervalRandom(100, 1000),
            skip: intervalRandom(0, 500),
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
    const {data: users} = await getUsers({limit: 10000, skip: 0});
    const urls = apiUrls.sport;

    result.push(`${urls.prefix}${urls.getSports}`);

    new Array(10).fill(true).forEach(() => {
        const sportId = sports[intervalRandom(0, sports.length - 1)].id!;
        result.push(`${urls.prefix}${urls.getUsersBySport.replace(':sportId', String(sportId))}?` +
            `${formQueryString({
                limit: intervalRandom(100, 1000),
                skip: intervalRandom(0, 500),
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

    new Array(10).fill(true).forEach(() => {
        const countryId = countries[intervalRandom(0, countries.length - 1)].id!;
        result.push(`${urls.prefix}${urls.getUsersByCountry.replace(':countryId', String(countryId))}?` +
            `${formQueryString({
                limit: intervalRandom(100, 1000),
                skip: intervalRandom(0, 500),
                order: Math.random() > 0.5 ? 'ASC' : 'DESC'
            })}`
        );
    });

    return result;
};

const generateExerciseTemplateSelect = async (): Promise<string[]> => {
    const result: string[] = [];
    // TODO write
    return result;
};

const generateExerciseSelect = async (): Promise<string[]> => {
    const result: string[] = [];
    // TODO write
    return result;
};

(async () => {
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
    process.exit();
})();
