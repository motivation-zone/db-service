import {checkCountry} from '../lib/countries-iso';
import {ErrorCode} from '../utils/HttpResponse';

export default class UserModel {
    public id?: number;
    public login?: string;
    public name?: string;
    public password?: string;
    public email?: string;
    public country?: string;
    public selfInfo?: string;
    public isAthlete?: boolean;
    public isBanned?: boolean;
    public weight?: number;
    public growth?: number;
    public birthDate?: Date;
    public registered?: Date;

    constructor() {

    }

    private checkNecessaryFields(fields: (keyof UserModel)[]): boolean {
        return fields.every((field) => {
            return Boolean(this[field]);
        });
    }

    formUser(data: any) {
        const {
            id, login, name, password, email, country,
            selfInfo, isAthlete, isBanned, weight, growth, birthDate, registered
        } = data;

        this.id = id;
        this.login = login;
        this.name = name;
        this.password = password;
        this.email = email;
        this.country = country;
        this.selfInfo = selfInfo;
        this.isAthlete = isAthlete;
        this.isBanned = isBanned;
        this.weight = weight;
        this.growth = growth;
        this.birthDate = this.parseDate(birthDate);
        this.registered = this.parseDate(registered);

        const checkCountryResult = checkCountry(this.country);

        if (!checkCountryResult) {
            return ErrorCode.UNSUPPORTED_FIELD_VALUE;
        }
    }

    formUserForCreate(data: any) {
        const {
            login, name, password, email, country,
            selfInfo, weight, growth, birthDate
        } = data;

        this.login = login;
        this.name = name;
        this.password = password;
        this.email = email;
        this.country = country;
        this.selfInfo = selfInfo;
        this.weight = weight;
        this.growth = growth;
        this.birthDate = this.parseDate(birthDate);

        const necessaryFields = ['login', 'name', 'password', 'email'] as (keyof UserModel)[];
        const checkNecessaryFieldsResult = this.checkNecessaryFields(necessaryFields);
        const checkCountryResult = checkCountry(this.country);

        if (!checkNecessaryFieldsResult) {
            return ErrorCode.REQUIRED_FIELDS;
        }

        if (!checkCountryResult) {
            return ErrorCode.UNSUPPORTED_FIELD_VALUE;
        }
    }

    parseDate(date: Date | string): Date | undefined {
        if (date instanceof Date) {
            return date;
        }

        if (typeof date === 'string') {
            return new Date(Date.parse(date));
        }
    }
};
