import fillUser from './user';

(async () => {
    // TODO truncate all tables before filling
    await fillUser();
    process.exit();
})();