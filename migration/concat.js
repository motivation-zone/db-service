const fs = require('fs');

const RESULT_FILE = `${__dirname}/result.pgsql`;
try {
    fs.unlinkSync(RESULT_FILE);
} catch (e) {}

const fileNames = [
    'training-type', 'country', 'sport', 'difficulty-level',
    'user', 'user-sport', 'exercise',
    'program', 'training', 'bought-program', 'user-program-saved'
];

fileNames.forEach((name) => {
    const data = fs.readFileSync(`${__dirname}/${name}.pgsql`);
    fs.appendFileSync(RESULT_FILE, data);
});

