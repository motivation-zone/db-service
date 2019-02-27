import {createUsers} from 'tests/fill/user';
import {query} from 'src/lib/db/client';

const truncateAll = async () => {
    await query({
        text: [
            'TRUNCATE TABLE users CASCADE',
            'TRUNCATE TABLE user_sport CASCADE'
        ].join(';'),
        values: []
    });
};

(async () => {
    await truncateAll();
    const users = await createUsers(20); // tslint:disable-line
    process.exit();
})();
