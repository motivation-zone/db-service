import request from 'supertest';
import faker from 'faker';

import app from 'src/app';
import UserModel, {IUserModel} from 'src/models/user';
import {API_URLS} from 'src/urls';
import {intervalRandom, formQueryString} from 'src/utils';
import {IResponse, formResponse} from 'src/utils/http/response';
import {IGetLimitTest} from 'tests/utils';

const urls = API_URLS.user;
const REQUEST_HEADERS = {Accept: 'application/json'};

const insertUser = async (user: IUserModel): Promise<IResponse<IUserModel[]>> => {
    return await new Promise((resolve, reject) => {
        request(app)
            .post(`${urls.prefix}${urls.create}`)
            .send(user)
            .set(REQUEST_HEADERS)
            .end((error, response) => {
                if (error) {
                    return reject(error);
                }

                const result = formResponse<IUserModel>(response, UserModel);
                resolve(result);
            });
    });
};

export const updateUser = async (id: number, data: any): Promise<IResponse<IUserModel[]>> => {
    return await new Promise((resolve, reject) => {
        request(app)
            .post(`${urls.prefix}${urls.updateById.replace(':id', String(id))}`)
            .send(data)
            .set(REQUEST_HEADERS)
            .end((error, response) => {
                if (error) {
                    return reject(error);
                }

                const result = formResponse<IUserModel>(response, UserModel);
                resolve(result);
            });
    });
};

export const getUserById = async (id: number): Promise<IResponse<IUserModel[]>> => {
    return await new Promise((resolve, reject) => {
        request(app)
            .get(`${urls.prefix}${urls.getById.replace(':id', String(id))}`)
            .set(REQUEST_HEADERS)
            .end((error, response) => {
                if (error) {
                    return reject(error);
                }

                const result = formResponse<IUserModel>(response, UserModel);
                resolve(result);
            });
    });
};

export const getUserByLogin = async (login: string, strict = true): Promise<IResponse<IUserModel[]>> => {
    return await new Promise((resolve, reject) => {
        request(app)
            .get(`${urls.prefix}/${urls.getByLogin.replace(':login', login)}?${!strict ? `strict=${strict}` : ''}`)
            .set(REQUEST_HEADERS)
            .end((error, response) => {
                if (error) {
                    return reject(error);
                }

                const result = formResponse<IUserModel>(response, UserModel);
                resolve(result);
            });
    });
};

export const checkUserPassword = async (login: string, password: string): Promise<IResponse<IUserModel[]>> => {
    return await new Promise((resolve, reject) => {
        request(app)
            .post(`${urls.prefix}/${urls.checkPassword}`)
            .send({login, password})
            .set(REQUEST_HEADERS)
            .end((error, response) => {
                if (error) {
                    return reject(error);
                }

                const result = formResponse<IUserModel>(response, UserModel);
                resolve(result);
            });
    });
};

export const getUsers = async (queryParams: IGetLimitTest): Promise<IResponse<IUserModel[]>> => {
    return await new Promise((resolve, reject) => {
        request(app)
            .get(`${urls.prefix}${urls.get}?${formQueryString(queryParams)}`)
            .set(REQUEST_HEADERS)
            .end((error, response) => {
                if (error) {
                    return reject(error);
                }

                const result = formResponse<IUserModel>(response, UserModel);
                resolve(result);
            });
    });
};

export const deleteUserById = async (id: number): Promise<IResponse<IUserModel[]>> => {
    return await new Promise((resolve, reject) => {
        request(app)
            .delete(`${urls.prefix}/${urls.deleteById.replace(':id', String(id))}`)
            .set(REQUEST_HEADERS)
            .end((error, response) => {
                if (error) {
                    return reject(error);
                }

                const result = formResponse<IUserModel>(response, UserModel);
                resolve(result);
            });
    });
};

export const dbActions = {
    insertUser,
    updateUser,
    getUserById,
    getUserByLogin,
    checkUserPassword,
    getUsers,
    deleteUserById
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
