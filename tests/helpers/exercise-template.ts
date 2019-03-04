import request from 'supertest';

import app from 'src/app';
import {API_URLS} from 'src/urls';
import {IResponse, formResponse} from 'src/utils/http/response';
import ExerciseTemplateModel, {IExerciseTemplateModel} from 'src/models/exercise-template';

const urls = API_URLS.exerciseTemplate;
const REQUEST_HEADERS = {Accept: 'application/json'};

const insertTemplate = async (template: IExerciseTemplateModel): Promise<IResponse<IExerciseTemplateModel[]>> => {
    return await new Promise((resolve, reject) => {
        request(app)
            .post(`${urls.prefix}${urls.create}`)
            .send(template)
            .set(REQUEST_HEADERS)
            .end((error, response) => {
                if (error) {
                    return reject(error);
                }

                const result = formResponse<ExerciseTemplateModel>(response, ExerciseTemplateModel);
                resolve(result);
            });
    });
};

export const dbActions = {
    insertTemplate
};
