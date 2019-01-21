export interface IUserModel {
    id?: number;
    login?: string;
    name?: string;
    password?: string;
    email?: string;
    selfInfo?: string;
    gender?: boolean;
    countryId?: number;
    isAthlete?: boolean;
    isBanned?: boolean;
    weight?: number;
    growth?: number;
    instagram?: string;
    phone?: string;
    birthDate?: Date;
    registeredDate?: Date;
}

export const REQUIRED_FIELDS: (keyof IUserModel)[] = ['login', 'name', 'password', 'email', 'gender'];
export const NOT_UPDATED_FIELDS: (keyof IUserModel)[] = ['id', 'login', 'registeredDate'];

export default class UserModel implements IUserModel {
    public id?: number;
    public login?: string;
    public name?: string;
    public password?: string;
    public email?: string;
    public gender?: boolean;
    public selfInfo?: string;
    public countryId?: number;
    public isAthlete?: boolean;
    public isBanned?: boolean;
    public weight?: number;
    public growth?: number;
    public instagram?: string;
    public phone?: string;
    public birthDate?: Date;
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

    static parseDate(date: Date | string): Date | undefined {
        if (date instanceof Date) {
            return date;
        }

        if (typeof date === 'string') {
            return new Date(Date.parse(date));
        }
    }
};
