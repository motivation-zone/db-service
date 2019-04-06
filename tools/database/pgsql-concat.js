const fs = require('fs');

const ROOT_PATH = `${process.cwd()}/migration`;
const RESULT_FILE = `${ROOT_PATH}/result.pgsql`;
try {
    fs.unlinkSync(RESULT_FILE);
} catch (e) {}

const fileNames = [
    'extensions',
    'training-type', 'country', 'sport', 'difficulty-level',
    'user', 'user-sport', 'exercise',
    'program', 'training', 'bought-program', 'user-program-saved'
];

fileNames.forEach((name) => {
    const data = fs.readFileSync(`${ROOT_PATH}/${name}.pgsql`);
    fs.appendFileSync(RESULT_FILE, data);
});

console.log(`\x1b[32m%s\x1b[0m`, 'Successfully concat');
