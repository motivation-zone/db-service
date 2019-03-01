import {readFileSync} from 'fs';
import {exec} from 'child_process';

import {dbActions as userDbActions, generateUser} from 'tests/helpers/user';
import {query} from 'src/lib/db/client';
import {getAbsolutePath} from 'src/utils/fs';
import {CREATED_USERS_COUNT} from 'tests/const';
import {dbActions as sportDbActions} from 'tests/helpers/sport';
import {intervalRandom} from 'src/utils';
import {dbActions as countryDbActions} from 'tests/helpers/country';

const {getAllCountries} = countryDbActions;
const {getAllSports, insertUserSportLink} = sportDbActions;
const {insertUser} = userDbActions;

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
    const users = await Promise.all(countsArray.map(async (isCountryExist) => {
        const countryId = intervalRandom(countries[0].id, countries[countries.length - 1].id);
        const newUser = generateUser({countryId: isCountryExist ? countryId : undefined});
        const {data: [user]} = await insertUser(newUser);
        return user;
    }));

    const {data: sports} = await getAllSports();
    await Promise.all(users.map(async (user) => {
        const sportId = intervalRandom(sports[0].id!, sports[sports.length - 1].id!);
        await insertUserSportLink(user.id!, sportId);
    }));

    process.exit();
})();
