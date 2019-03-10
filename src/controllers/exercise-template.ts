import express, {Request, Response} from 'express';

import ExerciseTemplateService from 'src/services/exercise-template';
import HttpResponse from 'src/utils/http/response';
import {
    checkGetLimitParameters,
    asyncMiddlewareWrapper
} from 'src/utils';
import {API_URLS} from 'src/urls';
import ExerciseTemplateModel from 'src/models/exercise-template';

const exerciseTemplateController = express();
const urls = API_URLS.exerciseTemplate;

exerciseTemplateController.get(urls.get, asyncMiddlewareWrapper(async (req: Request, res: Response) => {
    const {userId} = req.params;
    const {sportId} = req.query;

    const limitParameters = await checkGetLimitParameters(req.query);
    const result = await ExerciseTemplateService.getUserExerciseTemplates(limitParameters, userId, sportId);
    HttpResponse.ok(res, result);
}));

exerciseTemplateController.post(urls.create, asyncMiddlewareWrapper(async (req: Request, res: Response) => {
    const exerciseTemplate = new ExerciseTemplateModel(req.body);
    await exerciseTemplate.validateForCreate();
    const result = await ExerciseTemplateService.createExerciseTemplate(exerciseTemplate);
    HttpResponse.ok(res, result);
}));

exerciseTemplateController.get(urls.getById, asyncMiddlewareWrapper(async (req: Request, res: Response) => {
    const {templateId} = req.params;
    const result = await ExerciseTemplateService.getExerciseTemplate(templateId);
    HttpResponse.ok(res, result);
}));

exerciseTemplateController.post(urls.updateById, asyncMiddlewareWrapper(async (req: Request, res: Response) => {
    const {templateId} = req.params;
    const template = new ExerciseTemplateModel(req.body);
    template.clearNotUpdatedFields();

    const result = await ExerciseTemplateService.updateExerciseTemplate(templateId, template);
    HttpResponse.ok(res, result);
}));

exerciseTemplateController.delete(urls.deleteById, asyncMiddlewareWrapper(async (req: Request, res: Response) => {
    const {templateId} = req.params;
    const result = await ExerciseTemplateService.deleteExerciseTemplate(templateId);
    HttpResponse.ok(res, result);
}));

export default exerciseTemplateController;
