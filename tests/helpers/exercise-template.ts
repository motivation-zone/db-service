import request from 'supertest';
import faker from 'faker';

import app from 'src/app';
import {API_URLS} from 'src/urls';
import {IResponse, formResponse} from 'src/utils/http/response';
import ExerciseTemplateModel, {IExerciseTemplateModel} from 'src/models/exercise-template';
import {IGetLimitTest} from 'tests/utils';
import {formQueryString} from 'src/utils';

const urls = API_URLS.exerciseTemplate;
const REQUEST_HEADERS = {Accept: 'application/json'};
const TEMPLATE_ID = ':templateId';

const insertExerciseTemplate = async (
    template: IExerciseTemplateModel
): Promise<IResponse<IExerciseTemplateModel[]>> => {
    return await new Promise((resolve, reject) => {
        request(app)
            .post(`${urls.prefix}${urls.create}`)
            .send(template)
            .set(REQUEST_HEADERS)
            .end((error, response) => {
                if (error) {
                    return reject(error);
                }

                const result = formResponse<IExerciseTemplateModel>(response, ExerciseTemplateModel);
                resolve(result);
            });
    });
};

const getExerciseTemplates = async (
        params: {userId?: number, sportId?: number},
        queryParams: IGetLimitTest
): Promise<IResponse<IExerciseTemplateModel[]>> => {
    const {userId, sportId} = params;
    queryParams = Object.assign({sportId}, queryParams);

    return await new Promise((resolve, reject) => {
        request(app)
            .get([
                `${urls.prefix}${urls.get}`.replace(':userId', String(userId)),
                `?${formQueryString(queryParams)}`
            ].join(''))
            .set(REQUEST_HEADERS)
            .end((error, response) => {
                if (error) {
                    return reject(error);
                }

                const result = formResponse<IExerciseTemplateModel>(response, ExerciseTemplateModel);
                resolve(result);
            });
    });
};

const getExerciseTemplate = async (templateId: number): Promise<IResponse<IExerciseTemplateModel[]>> => {
    return await new Promise((resolve, reject) => {
        request(app)
            .get(`${urls.prefix}${urls.getById}`.replace(TEMPLATE_ID, String(templateId)))
            .set(REQUEST_HEADERS)
            .end((error, response) => {
                if (error) {
                    return reject(error);
                }

                const result = formResponse<IExerciseTemplateModel>(response, ExerciseTemplateModel);
                resolve(result);
            });
    });
};

const updateExerciseTemplate = async (
    templateId: number, template: IExerciseTemplateModel
): Promise<IResponse<IExerciseTemplateModel[]>> => {
    return await new Promise((resolve, reject) => {
        request(app)
            .post(`${urls.prefix}${urls.updateById}`.replace(TEMPLATE_ID, String(templateId)))
            .send(template)
            .set(REQUEST_HEADERS)
            .end((error, response) => {
                if (error) {
                    return reject(error);
                }

                const result = formResponse<IExerciseTemplateModel>(response, ExerciseTemplateModel);
                resolve(result);
            });
    });
};

const deleteExerciseTemplate = async (templateId: number): Promise<IResponse<IExerciseTemplateModel[]>> => {
    return await new Promise((resolve, reject) => {
        request(app)
            .delete(`${urls.prefix}${urls.deleteById}`.replace(TEMPLATE_ID, String(templateId)))
            .set(REQUEST_HEADERS)
            .end((error, response) => {
                if (error) {
                    return reject(error);
                }

                const result = formResponse<IExerciseTemplateModel>(response, ExerciseTemplateModel);
                resolve(result);
            });
    });
};

export const dbActions = {
    insertExerciseTemplate,
    getExerciseTemplates,
    getExerciseTemplate,
    updateExerciseTemplate,
    deleteExerciseTemplate
};

export const generateExerciseTemplate = (userId: number, sportId: number): IExerciseTemplateModel => {
    const {lorem, finance} = faker;

    return new ExerciseTemplateModel({
        userId,
        sportId,
        title: `${lorem.words()}${finance.account()}`,
        description: lorem.sentences()
    });
};
