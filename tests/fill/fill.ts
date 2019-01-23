import {createUsers} from './user';

(async () => {
    // TODO truncate all tables before filling
    
    await createUsers(10);
    process.exit();
})();