import jwt from 'jsonwebtoken';

import consoleLogger from 'src/lib/logger/console-logger';

const privateKey = process.env.MZ_DB_SERVICE_PRIVATE_KEY;
if (!privateKey) {
    consoleLogger.error('MZ_DB_SERVICE_PRIVATE_KEY didn\'t find');
} else {
    const token = jwt.sign({access: 'ok'}, privateKey!);
    consoleLogger.ok(`Token: ${token}`);
}
