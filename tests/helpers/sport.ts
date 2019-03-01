import request from 'supertest';

import app from 'src/app';
import {API_URLS} from 'src/urls';
import SportModel, {ISportModel} from 'src/models/sport';
import LinkUserSportModel, {ILinkUserSportModel} from 'src/models/link/user-sport';
import UserModel, {IUserModel} from 'src/models/user';
import {IResponse, formResponse} from 'src/utils/http/response';
import {IGetLimitTest} from 'tests/utils';
import {formQueryString} from 'src/utils';

const urls = API_URLS.sport;
const REQUEST_HEADERS = {Accept: 'application/json'};

const getAllSports = async (): Promise<IResponse<ISportModel[]>> => {
    return await new Promise((resolve, reject) => {
        request(app)
            .get(`${urls.prefix}${urls.get}`)
            .set(REQUEST_HEADERS)
            .end((error, response) => {
                if (error) {
                    return reject(error);
                }

                const result = formResponse<SportModel>(response, SportModel);
                resolve(result);
            });
    });
};

const insertUserSportLink = async (userId: number, sportId: number): Promise<IResponse<ILinkUserSportModel[]>> => {
    return new Promise((resolve, reject) => {
        request(app)
            .post(`${urls.prefix}${urls.updateUserSport.replace(':actionType', 'add')}`)
            .send({userId, sportId})
            .set(REQUEST_HEADERS)
            .end((error, response) => {
                if (error) {
                    return reject(error);
                }

                const result = formResponse<LinkUserSportModel>(response, LinkUserSportModel);
                resolve(result);
            });
    });
};

const deleteUserSportLink = async (userId: number, sportId: number): Promise<IResponse<ILinkUserSportModel[]>> => {
    return new Promise((resolve, reject) => {
        request(app)
            .post(`${urls.prefix}${urls.updateUserSport.replace(':actionType', 'delete')}`)
            .send({userId, sportId})
            .set(REQUEST_HEADERS)
            .end((error, response) => {
                if (error) {
                    return reject(error);
                }

                const result = formResponse<LinkUserSportModel>(response, LinkUserSportModel);
                resolve(result);
            });
    });
};

const getUsersBySport = async (sportId: number, queryParams: IGetLimitTest): Promise<IResponse<IUserModel[]>> => {
    return await new Promise((resolve, reject) => {
        request(app)
            .get(`${urls.prefix}${urls.getUsersBySport
                .replace(':id', String(sportId))}?${formQueryString(queryParams)}`)
            .set(REQUEST_HEADERS)
            .end((error, response) => {
                if (error) {
                    return reject(error);
                }

                const result = formResponse<IUserModel>(response, UserModel);
                resolve(result);
            });
    });
};

const getUserSports = async (userId: number): Promise<IResponse<ISportModel[]>> => {
    return await new Promise((resolve, reject) => {
        request(app)
            .get(`${urls.prefix}${urls.getUserSports.replace(':id', String(userId))}`)
            .set(REQUEST_HEADERS)
            .end((error, response) => {
                if (error) {
                    return reject(error);
                }

                const result = formResponse<ISportModel>(response, SportModel);
                resolve(result);
            });
    });
};

export const dbActions = {
    getAllSports,
    insertUserSportLink,
    getUsersBySport,
    deleteUserSportLink,
    getUserSports
};
