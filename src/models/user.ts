import Boom from 'boom';
import * as yup from 'yup';

import HttpResponse from '../utils/http/response';
import HttpErrors from '../utils/http/errors';

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

// Ex: +7(987)713-55-32
const phoneRegexp = /^\+[0-9]{1,4}\([0-9]{3}\)[0-9]{3}\-[0-9]{2}\-[0-9]{2}$/;
const VALIDATION_SCHEMES = {
    create: {
        login: yup.string().required(),
        name: yup.string().required(),
        password: yup.string().required(),
        email: yup.string().email().required(),
        gender: yup.boolean().required(),
        isAthlete: yup.boolean().notRequired(),
        selfInfo: yup.string().notRequired(),
        weight: yup.number().positive().notRequired(),
        growth: yup.number().positive().notRequired(),
        countryId: yup.number().positive().integer().notRequired(),
        birthDate: yup.date().notRequired(),
        isBanned: yup.boolean().notRequired(),
        instagram: yup.string().notRequired(),
        phone: yup.string().matches(phoneRegexp, HttpErrors.INVALID_PHONE_NUMBER).notRequired(),
        registeredDate: yup.date().notRequired()
    },
    update: {},
    get: {}
};

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

    constructor(data: any) {
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
    }

    clearNotUpdatedFields(): void {
        NOT_UPDATED_FIELDS.forEach((field) => delete this[field]);
    }

    async validateForCreate(): Promise<void> {
        const schema = yup.object().shape(VALIDATION_SCHEMES.create);
        try {
            await schema.validate(this);
        } catch (e) {
            // TODO change names from e.errors on HttpErrors.* types
            HttpResponse.error(Boom.badRequest, e.errors.join(', '));
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
}
