import * as Boom from 'boom';

import HttpResponse from '../utils/http/response';
import HttpErrors from '../utils/http/errors';
import {checkRequiredFields} from '../utils';

export interface IUserModel {
    id?: number;
    login?: string;
    name?: string;
    password?: string;
    email?: string;
    isAthlete?: boolean;
    gender?: boolean;
    selfInfo?: string;
    weight?: number;
    growth?: number;
    countryId?: number;
    birthDate?: Date;
    isBanned?: boolean;
    instagram?: string;
    phone?: string;
    registeredDate?: Date;
}

interface IOptions {
    checkRequiredFields?: boolean;
    clearNotUpdatedFields?: boolean;
}

const REQUIRED_FIELDS: (keyof IUserModel)[] = ['login', 'name', 'password', 'email', 'gender'];
const NOT_UPDATED_FIELDS: (keyof IUserModel)[] = ['id', 'login', 'registeredDate'];

export default class UserModel implements IUserModel {
    public id?: number;
    public login?: string;
    public name?: string;
    public password?: string;
    public email?: string;
    public isAthlete?: boolean;
    public gender?: boolean;
    public selfInfo?: string;
    public weight?: number;
    public growth?: number;
    public countryId?: number;
    public birthDate?: Date;
    public isBanned?: boolean;
    public instagram?: string;
    public phone?: string;
    public registeredDate?: Date;

    constructor(data: any, options: IOptions = {}) {
        const {
            id, login, name, password, email, selfInfo, gender,
            isAthlete, isBanned, weight, growth, birthDate,
            countryId, instagram, phone, registeredDate
        } = data;

        this.id = id;
        this.login = login;
        this.name = name;
        this.password = password;
        this.email = email;
        this.selfInfo = selfInfo;
        this.gender = gender;
        this.isAthlete = isAthlete;
        this.weight = weight;
        this.growth = growth;
        this.instagram = instagram;
        this.phone = phone;
        this.isBanned = isBanned;
        this.countryId = countryId;
        this.birthDate = UserModel.parseDate(birthDate);
        this.registeredDate = UserModel.parseDate(registeredDate);

        if (options.clearNotUpdatedFields) {
            NOT_UPDATED_FIELDS.forEach((field) => delete this[field]);
        }

        if (options.checkRequiredFields) {
            const check = checkRequiredFields(REQUIRED_FIELDS, this);
            if (!check) {
                throw HttpResponse.error(Boom.badRequest, HttpErrors.MISSING_PARAMS);
            }
        }
    }

    static parseDate(date: Date | string | undefined): Date | undefined {
        if (!date) {
            return;
        }

        if (date instanceof Date) {
            return date;
        }

        if (typeof date === 'string') {
            return new Date(Date.parse(date));
        }
    }
};
