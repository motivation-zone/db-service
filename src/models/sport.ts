export interface ISportModel {
    id?: number;
    name?: string;
}

export default class SportModel implements ISportModel {
    public id?: number;
    public name?: string;

    constructor(data: any) {
        const {id, name} = data;

        this.id = id && Number(id);
        this.name = name;
    }
}
