import jwt from 'jsonwebtoken';

const privateKey = process.env.MZ_DB_SERVICE_PRIVATE_KEY;
if (!privateKey) {
    console.log('MZ_DB_SERVICE_PRIVATE_KEY didn\'t find'); // tslint:disable-line
} else {
    const token = jwt.sign({access: 'ok'}, privateKey!);
    console.log(`TOKEN: ${token}`); // tslint:disable-line
}
