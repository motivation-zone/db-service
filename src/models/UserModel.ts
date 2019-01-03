interface UserInterface {
    id?: number;
    login?: string;
    name?: string;
    password?: string;
    email?: string;
    selfInfo?: string;
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

export const REQUIRED_FIELDS = ['login', 'name', 'password', 'email'];
export const NOT_UPDATED_FIELDS = ['id', 'login', 'registered'];


export default class UserModel implements UserInterface {
    public id?: number;
    public login?: string;
    public name?: string;
    public password?: string;
    public email?: string;
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
            id, login, name, password, email, selfInfo,
            isAthlete, isBanned, weight, growth, birthDate,
            countryId, instagram, phone, registeredDate
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
        this.instagram = instagram;
        this.phone = phone;
        this.isBanned = isBanned;
        this.countryId = countryId;
        this.birthDate = this.parseDate(birthDate);
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
