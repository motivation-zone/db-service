export interface ICountryModel {
    id?: number;
    name?: string;
    alpha2?: string;
    alpha3?: string;
    unCode?: string;
}

export default class CountryModel {
    public id?: number;
    public name?: string;
    public alpha2?: string;
    public alpha3?: string;
    public unCode?: string;

    constructor(data: any) {
        const {id, name, alpha2, alpha3, unCode} = data;

        this.id = id;
        this.name = name;
        this.alpha2 = alpha2;
        this.alpha3 = alpha3;
        this.unCode = unCode;
    }
}
