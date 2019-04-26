import fs from 'fs';

import {getAbsolutePath} from '../../src/utils/fs';
import consoleLogger from '../../src/lib/logger/console-logger';

const ROOT_PATH = getAbsolutePath(`./migration`);
const RESULT_FILE = `${ROOT_PATH}/result.pgsql`;

try {
    fs.unlinkSync(RESULT_FILE);
} catch (e) {}

const files = [
    'extensions',
    'training-type', 'country', 'sport', 'difficulty-level',
    'user', 'user-sport', 'exercise',
    'program', 'training', 'bought-program', 'user-program-saved'
];

files.forEach((file) => {
    const data = fs.readFileSync(`${ROOT_PATH}/${file}.pgsql`);
    fs.appendFileSync(RESULT_FILE, data);
});

consoleLogger.ok('Successfully concat');
