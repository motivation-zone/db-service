export const REQUIRED_FIELDS = ['login', 'name', 'password', 'email'];

export default class UserModel {
    public id?: number;
    public login?: string;
    public name?: string;
    public password?: string;
    public email?: string;
    public selfInfo?: string;
    public isAthlete?: boolean;
    public isBanned?: boolean;
    public weight?: number;
    public growth?: number;
    public instagramLink?: string;
    public phone?: string;
    public birthDate?: Date;
    public registeredDate?: Date;

    constructor(data: any) {
        const {
            id, login, name, password, email, selfInfo,
            isAthlete, isBanned, weight, growth, birthDate,
            instagramLink, phone, registeredDate
        } = data;

        this.id = id;
        this.login = login;
        this.name = name;
        this.password = password;
        this.email = email;
        this.selfInfo = selfInfo;
        this.isAthlete = isAthlete;
        this.weight = weight;
        this.growth = growth;
        this.instagramLink = instagramLink;
        this.phone = phone;
        this.birthDate = this.parseDate(birthDate);
        this.isBanned = isBanned;
        this.registeredDate = this.parseDate(registeredDate);
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
