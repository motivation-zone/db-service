import jwt from 'jsonwebtoken';

export default async (token: string): Promise<boolean> => {
    const privateKey = process.env.MZ_DB_SERVICE_PRIVATE_KEY;
    if (!privateKey) {
        return false;
    }

    return await new Promise((resolve) => {
        jwt.verify(token, privateKey, (err, decoded: any) => {
            if (err) {
                return resolve(false);
            }

            resolve(decoded.access === 'ok');
        });
    });
};
