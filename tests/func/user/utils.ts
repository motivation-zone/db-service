import faker from 'faker';

import UserModel, {IUserModel} from '../../../src/models/user';
import {intervalRandom} from '../../../src/utils';

const {internet, name, random, lorem, phone, date} = faker;

const generatePhone = () => {
    const row = phone.phoneNumberFormat().split('-');
    return `+7(${row[0]})${row[1]}-${row[2].slice(0, 2)}-${row[2].slice(2)}`;
};

export const generateUser = (countryIdInterval: number[]): IUserModel => {
    return new UserModel({
        login: internet.userName(),
        name: name.findName(),
        password: internet.password(),
        email: internet.email(),
        selfInfo: lorem.text(),
        gender: random.boolean(),
        countryId: intervalRandom(countryIdInterval[0], countryIdInterval[1]),
        weight: intervalRandom(50, 120),
        growth: intervalRandom(120, 250),
        instagram: internet.userName().toLowerCase(),
        phone: generatePhone(),
        birthDate: date.past().toISOString().split('T')[0]
    });
};
