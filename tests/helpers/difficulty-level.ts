import request from 'supertest';

import app from 'src/app';
import {API_URLS} from 'src/urls';
import {IResponse, formResponse} from 'src/utils/http/response';
import DifficultyLevelModel, {IDifficultyLevelModel} from 'src/models/difficulty-level';

const urls = API_URLS.difficultyLevel;
const REQUEST_HEADERS = {Accept: 'application/json'};

const getAllDifficultyLevels = async (): Promise<IResponse<IDifficultyLevelModel[]>> => {
    return await new Promise((resolve, reject) => {
        request(app)
            .get(`${urls.prefix}${urls.get}`)
            .set(REQUEST_HEADERS)
            .end((error, response) => {
                if (error) {
                    return reject(error);
                }

                const result = formResponse<DifficultyLevelModel>(response, DifficultyLevelModel);
                resolve(result);
            });
    });
};

export const dbActions = {
    getAllDifficultyLevels
};
