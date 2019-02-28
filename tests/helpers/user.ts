import request from 'supertest';
import faker from 'faker';

import app from 'src/app';
import UserModel, {IUserModel} from 'src/models/user';
import {API_URLS} from 'src/urls';
import {getAllCountriesFromDB} from 'tests/helpers/country';
import {intervalRandom} from 'src/utils';

const userUrls = API_URLS.user;

export const insertUsersToDB = async (count: number): Promise<IUserModel[]> => {
    const countries = await getAllCountriesFromDB();

    // this array fill on 50/50 true/false for creating users with country and without
    const countsArray = [...new Array(count / 2).fill(true), ...new Array(count / 2).fill(false)];
    return await Promise.all((countsArray).map(async (isCountryExist) => {
        const countryId = intervalRandom(countries[0].id, countries[countries.length - 1].id);
        const user = generateUser({countryId: isCountryExist ? countryId : undefined});
        return await new Promise((resolve, reject) => {
            request(app)
                .post(`${userUrls.prefix}${userUrls.create}`)
                .send(user)
                .set('Accept', 'application/json')
                .end((err: Error, res: request.Response) => {
                    if (err || res.status !== 200) {
                        return reject(err || res.body);
                    }
                    resolve(new UserModel(res.body.data[0]));
                });
        });
    }));
};

export const getUsersFromDB = async (limit: number, skip: number): Promise<IUserModel[]> => {
    return await new Promise((resolve, reject) => {
        request(app)
            .get(`${userUrls.prefix}${userUrls.get}?limit=${limit}&skip=${skip}`)
            .set('Accept', 'application/json')
            .end((err: Error, res: request.Response) => {
                if (err || res.status !== 200) {
                    return reject(err || res.body);
                }
                resolve(res.body.data.map((user: any) => new UserModel(user)));
            });
    });
};

const generatePhone = () => {
    const {phone} = faker;
    const row = phone.phoneNumberFormat().split('-');
    return `+7(${row[0]})${row[1]}-${row[2].slice(0, 2)}-${row[2].slice(2)}`;
};

export const generateUser = (overrites: IUserModel = {}): IUserModel => {
    const {internet, name, random, lorem, date} = faker;

    const user = new UserModel({
        login: internet.userName(),
        name: name.findName(),
        password: internet.password(),
        email: internet.email(),
        selfInfo: lorem.text(),
        gender: random.boolean(),
        countryId: overrites.countryId,
        weight: intervalRandom(50, 120),
        growth: intervalRandom(120, 250),
        instagram: internet.userName().toLowerCase(),
        phone: generatePhone(),
        birthDate: date.past().toISOString().split('T')[0]
    });

    Object.assign(user, overrites);
    return user;
};
