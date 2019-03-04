import express, {Request, Response} from 'express';

import ExerciseTemplateService from 'src/services/exercise-template';
import HttpResponse from 'src/utils/http/response';
import {
    getNotEmptyFields,
    checkGetLimitParameters,
    asyncMiddlewareWrapper
} from 'src/utils';
import {API_URLS} from 'src/urls';
import ExerciseTemplateModel from 'src/models/exercise-template';

const exerciseController = express();
const urls = API_URLS.exerciseTemplate;

exerciseController.get(urls.get, asyncMiddlewareWrapper(async (req: Request, res: Response) => {
    const {userId} = req.params;
    const {sportId} = req.query;

    const limitParameters = await checkGetLimitParameters(req.query);
    const result = await ExerciseTemplateService.getUserExerciseTemplates(limitParameters, userId, sportId);
    HttpResponse.ok(res, result);
}));

exerciseController.post(urls.create, asyncMiddlewareWrapper(async (req: Request, res: Response) => {
    const exerciseTemplate = new ExerciseTemplateModel(req.body);
    exerciseTemplate.validateForCreate();
    const result = await ExerciseTemplateService.createExerciseTemplate(exerciseTemplate);
    HttpResponse.ok(res, result);
}));

exerciseController.get(urls.getById, asyncMiddlewareWrapper(async (req: Request, res: Response) => {
    const {templateId} = req.params;
    const result = await ExerciseTemplateService.getExerciseTemplate(templateId);
    HttpResponse.ok(res, result);
}));

exerciseController.delete(urls.deleteById, asyncMiddlewareWrapper(async (req: Request, res: Response) => {
    const {templateId} = req.params;
    const result = await ExerciseTemplateService.deleteExerciseTemplate(templateId);
    HttpResponse.ok(res, result);
}));

exerciseController.post(urls.updateById, asyncMiddlewareWrapper(async (req: Request, res: Response) => {
    const fields = getNotEmptyFields(req.body, ['userId']);
    const {templateId} = req.params;

    const result = await ExerciseTemplateService.updateExerciseTemplate(
        templateId,
        fields,
        req.body
    );
    HttpResponse.ok(res, result);
}));

export default exerciseController;
