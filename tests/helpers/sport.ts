import {apiUrls} from 'src/urls';
import SportModel, {ISportModel} from 'src/models/sport';
import LinkUserSportModel, {ILinkUserSportModel} from 'src/models/link/user-sport';
import UserModel, {IUserModel} from 'src/models/user';
import {IGetLimitTest} from 'tests/utils';
import {formQueryString} from 'src/utils';

import {getRequest, postRequest} from 'tests/helpers/common';

const urls = apiUrls.sport;

const getAllSports = async () => {
    return await getRequest<ISportModel>({
        url: `${urls.prefix}${urls.getSports}`,
        ModelClass: SportModel
    });
};

const insertUserSportLink = async (linkUserSport: ILinkUserSportModel) => {
    return await postRequest<ILinkUserSportModel>({
        url: `${urls.prefix}${urls.updateUserSport.replace(':actionType', 'add')}`,
        ModelClass: LinkUserSportModel,
        data: linkUserSport
    });
};

const deleteUserSportLink = async (linkUserSport: ILinkUserSportModel) => {
    return await postRequest<ILinkUserSportModel>({
        url: `${urls.prefix}${urls.updateUserSport.replace(':actionType', 'delete')}`,
        ModelClass: LinkUserSportModel,
        data: linkUserSport
    });
};

const getUsersBySport = async (sportId: number, limitParams: IGetLimitTest) => {
    return await getRequest<IUserModel>({
        url: `${urls.prefix}${urls.getUsersBySport
            .replace(':sportId', String(sportId))}?${formQueryString(limitParams)}`,
        ModelClass: UserModel
    });
};

const getUserSports = async (userId: number) => {
    return await getRequest<ISportModel>({
        url: `${urls.prefix}${urls.getUserSports.replace(':userId', String(userId))}`,
        ModelClass: SportModel
    });
};

export const dbActions = {
    getAllSports,
    insertUserSportLink,
    getUsersBySport,
    deleteUserSportLink,
    getUserSports
};
