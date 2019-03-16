import faker from 'faker';

import UserModel, {IUserModel} from 'src/models/user';
import {apiUrls} from 'src/urls';
import {intervalRandom, formQueryString, parseDate} from 'src/utils';
import {IGetLimitTest} from 'tests/utils';
import {getRequest, postRequest, deleteRequest} from 'tests/helpers/common';

const urls = apiUrls.user;

const insertUser = async (user: IUserModel) => {
    return await postRequest<IUserModel>({
        url: `${urls.prefix}${urls.createUser}`,
        ModelClass: UserModel,
        data: user
    });
};

const updateUser = async (userId: string, user: IUserModel) => {
    return await postRequest<IUserModel>({
        url: `${urls.prefix}${urls.updateUserById.replace(':userId', userId)}`,
        ModelClass: UserModel,
        data: user
    });
};

const getUserById = async (userId: string) => {
    return await getRequest<IUserModel>({
        url: `${urls.prefix}${urls.getUserById.replace(':userId', userId)}`,
        ModelClass: UserModel
    });
};

const getUserByLogin = async (login: string, strict = true) => {
    return await getRequest<IUserModel>({
        url: `${urls.prefix}/${urls.getUserByLogin.replace(':login', login)}?${!strict ? `strict=${strict}` : ''}`,
        ModelClass: UserModel
    });
};

const checkUserPassword = async (login: string, password: string) => {
    return await postRequest<IUserModel>({
        url: `${urls.prefix}/${urls.checkUserPassword}`,
        ModelClass: UserModel,
        data: {login, password}
    });
};

const getUsers = async (limitParams: IGetLimitTest) => {
    return await getRequest<IUserModel>({
        url: `${urls.prefix}${urls.getUsers}?${formQueryString(limitParams)}`,
        ModelClass: UserModel
    });
};

const deleteUserById = async (userId: string) => {
    return await deleteRequest<IUserModel>({
        url: `${urls.prefix}/${urls.deleteUserById.replace(':userId', userId)}`,
        ModelClass: UserModel
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
    const {internet, name, random, lorem, date, finance} = faker;

    const user = new UserModel({
        login: `${internet.userName()}_${finance.account()}`,
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
        birthDate: parseDate(date.past().toISOString().split('T')[0])
    });

    Object.assign(user, overrites);
    return user;
};
