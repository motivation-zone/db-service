export interface ILinkUserSportModel {
    id?: number;
    userId?: number;
    sportId?: number;
}

export default class LinkUserSportModel implements ILinkUserSportModel {
    public id?: number;
    public userId?: number;
    public sportId?: number;

    constructor(data: any) {
        const {id, userId, sportId} = data;

        this.id = id;
        this.userId = userId;
        this.sportId = sportId;
    }
}
