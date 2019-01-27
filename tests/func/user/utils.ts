import {generateString} from '../../utils';
import UserModel, {IUserModel} from '../../../src/models/UserModel';
import {intervalRandom} from '../../../src/utils/utils';

export const generateUser = (): IUserModel => {
    const gender = Math.random() > 0.5;
    const name = generateString(10);
    return new UserModel({
        login: `${generateString(intervalRandom(2, 5))}_${generateString(intervalRandom(2, 5))}`,
        name,
        password: generateString(10),
        email: `${name}@amail.ru`,
        selfInfo: 'smth about me',
        gender,
        countryId: 183,
        weight: 74.5,
        growth: 175,
        instagram: 'instagramnickname',
        phone: '7_123123123123',
        birthDate: '1997-06-01'
    });
};