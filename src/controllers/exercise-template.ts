import express, {Request, Response} from 'express';

import ExerciseTemplateService from 'src/services/exercise-template';
import HttpResponse from 'src/utils/http/response';
import {
    checkGetLimitParameters,
    asyncMiddlewareWrapper
} from 'src/utils';
import {apiUrls} from 'src/urls';
import ExerciseTemplateModel from 'src/models/exercise-template';

const controller = express();
const urls = apiUrls.exerciseTemplate;

controller.get(urls.getUserExerciseTemplates, asyncMiddlewareWrapper(async (req: Request, res: Response) => {
    const {userId} = req.params;
    const {sportId} = req.query;

    const limitParameters = await checkGetLimitParameters(req.query);
    const result = await ExerciseTemplateService.getUserExerciseTemplates(limitParameters, {userId, sportId});
    HttpResponse.ok(res, result);
}));

controller.post(urls.createExerciseTemplate, asyncMiddlewareWrapper(async (req: Request, res: Response) => {
    const exerciseTemplate = new ExerciseTemplateModel(req.body);
    await exerciseTemplate.validateForCreate();
    const result = await ExerciseTemplateService.createExerciseTemplate(exerciseTemplate);
    HttpResponse.ok(res, result);
}));

controller.get(urls.getExerciseTemplateById, asyncMiddlewareWrapper(async (req: Request, res: Response) => {
    const {templateId} = req.params;
    const result = await ExerciseTemplateService.getExerciseTemplate(templateId);
    HttpResponse.ok(res, result);
}));

controller.post(urls.updateExerciseTemplateById, asyncMiddlewareWrapper(async (req: Request, res: Response) => {
    const {templateId} = req.params;
    const template = new ExerciseTemplateModel(req.body);
    template.clearNotUpdatedFields();

    const result = await ExerciseTemplateService.updateExerciseTemplate(templateId, template);
    HttpResponse.ok(res, result);
}));

controller.delete(urls.deleteExerciseTemplateById, asyncMiddlewareWrapper(async (req: Request, res: Response) => {
    const {templateId} = req.params;
    const result = await ExerciseTemplateService.deleteExerciseTemplate(templateId);
    HttpResponse.ok(res, result);
}));

export default controller;
