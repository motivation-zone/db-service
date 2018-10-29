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

    constructor(
        id?: number, login?: string, password?: string, email?: string, country?: string,
        selfInfo?: string, name?: string, isAthlete?: boolean, isBanned?: boolean, weight?: number,
        growth?: number, birthDate?: Date, registered?: Date) {
        this.id = id;
        this.login = login;
        this.password = password;
        this.email = email;
        this.country = country;
        this.selfInfo = selfInfo;
        this.name = name;
        this.isAthlete = isAthlete;
        this.isBanned = isBanned;
        this.weight = weight;
        this.growth = growth;
        this.birthDate = birthDate;
        this.registered = registered;
    }
};
