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
    public birthDate?: Date;
    public registered?: Date;

    constructor(data: any) {
        const {
            id, login, name, password, email, selfInfo,
            isAthlete, isBanned, weight, growth, birthDate,
            registered
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
        this.birthDate = this.parseDate(birthDate);
        this.isBanned = isBanned;
        this.registered = this.parseDate(registered);
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
