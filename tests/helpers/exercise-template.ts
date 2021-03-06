import faker from 'faker';

import {apiUrls} from 'src/urls';
import ExerciseTemplateModel, {IExerciseTemplateModel} from 'src/models/exercise-template';
import {IGetLimitTest} from 'tests/utils';
import {getRequest, postRequest, deleteRequest} from 'tests/helpers/common';
import {formQueryString} from 'src/utils';

const urls = apiUrls.exerciseTemplate;
const TEMPLATE_ID = ':templateId';

interface IGetExerciseTemplates {
    userId?: string;
    sportId?: number;
    difficultyLevelId?: number;
    limitParams: IGetLimitTest;
}

const insertExerciseTemplate = async (template: IExerciseTemplateModel) => {
    return await postRequest<IExerciseTemplateModel>({
        url: `${urls.prefix}${urls.createExerciseTemplate}`,
        ModelClass: ExerciseTemplateModel,
        data: template
    });
};

const getUserExerciseTemplates = async ({userId, sportId, difficultyLevelId, limitParams}: IGetExerciseTemplates) => {
    const url = [
        `${urls.prefix}${urls.getUserExerciseTemplates}`.replace(':userId', userId!),
        `?${formQueryString({
            ...limitParams,
            sportId,
            difficultyLevelId
        })}`
    ].join('');

    return await getRequest<IExerciseTemplateModel>({
        url,
        ModelClass: ExerciseTemplateModel
    });
};

const getExerciseTemplate = async (templateId: string) => {
    return await getRequest<IExerciseTemplateModel>({
        url: `${urls.prefix}${urls.getExerciseTemplateById}`.replace(TEMPLATE_ID, templateId),
        ModelClass: ExerciseTemplateModel
    });
};

const updateExerciseTemplate = async (templateId: string, template: IExerciseTemplateModel) => {
    return await postRequest<IExerciseTemplateModel>({
        url: `${urls.prefix}${urls.updateExerciseTemplateById}`.replace(TEMPLATE_ID, templateId),
        ModelClass: ExerciseTemplateModel,
        data: template
    });
};

const deleteExerciseTemplate = async (templateId: string) => {
    return await deleteRequest<IExerciseTemplateModel>({
        url: `${urls.prefix}${urls.deleteExerciseTemplateById}`.replace(TEMPLATE_ID, templateId),
        ModelClass: ExerciseTemplateModel
    });
};

export const dbActions = {
    insertExerciseTemplate,
    getUserExerciseTemplates,
    getExerciseTemplate,
    updateExerciseTemplate,
    deleteExerciseTemplate
};

interface IGenerateParams {
    userId: string;
    sportId: number;
    difficultyLevelId: number;
}

export const generateExerciseTemplate = (params: IGenerateParams): IExerciseTemplateModel => {
    const {lorem, finance} = faker;
    const {userId, sportId, difficultyLevelId} = params;

    return new ExerciseTemplateModel({
        userId,
        sportId,
        title: `${lorem.words()}${finance.account()}`,
        difficultyLevelId,
        description: lorem.sentences()
    });
};
