import Boom from 'boom';
import Joi from 'joi';

import HttpResponse from 'src/utils/http/response';
import {parseDate, joiValidationErrorToString} from 'src/utils';

/**
 * @api
 * @type model
 * @name UserModel
 * @object {{
 *  "type": "object",
 *  "required": [
 *      "login",
 *      "name",
 *      "password",
 *      "email",
 *      "gender"
 *  ],
 *  "properties": [
 *      {
 *          "name": "id",
 *          "type": "number"
 *      }, {
 *          "name": "login",
 *          "type": "string"
 *      }, {
 *          "name": "name",
 *          "type": "string"
 *      }, {
 *          "name": "password",
 *          "type": "string"
 *      }, {
 *          "name": "email",
 *          "type": "string"
 *      }, {
 *          "name": "isAthlete",
 *          "type": "boolean"
 *      }, {
 *          "name": "gender",
 *          "type": "boolean"
 *      }, {
 *          "name": "selfInfo",
 *          "type": "string"
 *      }, {
 *          "name": "weight",
 *          "type": "number"
 *      }, {
 *          "name": "growth",
 *          "type": "number"
 *      }, {
 *          "name": "countryId",
 *          "type": "number"
 *      }, {
 *          "name": "birthDate",
 *          "type": "Date"
 *      }, {
 *          "name": "isBanned",
 *          "type": "boolean"
 *      }, {
 *          "name": "instagram",
 *          "type": "string"
 *      }, {
 *          "name": "phone",
 *          "type": "string"
 *      }, {
 *          "name": "registeredDate",
 *          "type": "Date"
 *      }
 *  ]
 * }}
 */
export interface IUserModel {
    id?: string;
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
        id: Joi.string(),
        login: Joi.string().required(),
        name: Joi.string().required(),
        password: Joi.string().required(),
        email: Joi.string().email().required(),
        gender: Joi.boolean().required(),
        isAthlete: Joi.boolean(),
        selfInfo: Joi.string(),
        weight: Joi.number().positive(),
        growth: Joi.number().positive(),
        countryId: Joi.number().positive().integer(),
        birthDate: Joi.date(),
        isBanned: Joi.boolean(),
        instagram: Joi.string(),
        phone: Joi.string().regex(phoneRegexp),
        registeredDate: Joi.date()
    }
};

export const NOT_UPDATED_FIELDS: (keyof IUserModel)[] = ['id', 'login', 'registeredDate'];
export const REQUIRED_FIELDS: (keyof IUserModel)[] = ['login', 'name', 'password', 'email', 'gender'];

export default class UserModel implements IUserModel {
    public id?: string;
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

    constructor(data: IUserModel) {
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
        this.countryId = countryId && Number(countryId);
        this.birthDate = parseDate(birthDate);
        this.registeredDate = parseDate(registeredDate);
    }

    clearNotUpdatedFields(): void {
        NOT_UPDATED_FIELDS.forEach((field) => delete this[field]);
    }

    async validateForCreate(): Promise<void> {
        try {
            await Joi.validate(this, VALIDATION_SCHEMES.create);
        } catch (e) {
            HttpResponse.throwError(Boom.badRequest, joiValidationErrorToString(e));
        }
    }
}
