import {readFileSync} from 'fs';

import {insertUsersToDB} from 'tests/helpers/user';
import {query} from 'src/lib/db/client';
import {exec} from 'child_process';
import {getAbsolutePath} from 'src/utils/fs';
import {CREATED_USERS_COUNT} from 'tests/const';

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
    await insertUsersToDB(CREATED_USERS_COUNT);

    process.exit();
})();
