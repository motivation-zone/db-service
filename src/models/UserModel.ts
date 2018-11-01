import {checkCountry} from '../lib/countries-iso';

export default class UserModel {
    public id?: number;
    public login?: string;
    public password?: string;
    public email?: string;
    public country?: string;
    public selfInfo?: string;
    public name?: string;
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

        return checkNecessaryFieldsResult && checkCountryResult;
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
