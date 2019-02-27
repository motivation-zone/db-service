import express, {Request, Response} from 'express';
import Boom from 'boom';

import ExerciseService from 'src/services/exercise';
import HttpResponse from 'src/utils/http/response';
import {getNotEmptyFields, checkGetLimitParameters, asyncMiddlewareWrapper} from 'src/utils';
import {API_URLS} from 'src/urls';
import HttpErrors from 'src/utils/http/errors';

const exerciseController = express();
const urls = API_URLS.exercise;

exerciseController.get(urls.template.getMany, asyncMiddlewareWrapper(async (req: Request, res: Response) => {
    const {userId} = req.params;
    const {sportId} = req.query;

    const limitParameters = checkGetLimitParameters(req.query);
    const result = await ExerciseService.getUserExerciseTemplates(limitParameters, userId, sportId);
    HttpResponse.ok(res, result);
}));

exerciseController.post(urls.template.create, asyncMiddlewareWrapper(async (req: Request, res: Response) => {
    const {title, description, userId, sportId} = req.body;
    if (!title || !description || !userId || !sportId) {
        throw Boom.badRequest(HttpErrors.MISSING_PARAMS);
    }

    const result = await ExerciseService.createExerciseTemplate({
        title, description, userId, sportId
    });
    HttpResponse.ok(res, result);
}));

exerciseController.get(urls.template.get, asyncMiddlewareWrapper(async (req: Request, res: Response) => {
    const {templateId} = req.params;
    const result = await ExerciseService.getExerciseTemplate(templateId);
    HttpResponse.ok(res, result);
}));

exerciseController.delete(urls.template.delete, asyncMiddlewareWrapper(async (req: Request, res: Response) => {
    const {templateId} = req.params;
    const result = await ExerciseService.deleteExerciseTemplate(templateId);
    HttpResponse.ok(res, result);
}));

exerciseController.post(urls.template.update, asyncMiddlewareWrapper(async (req: Request, res: Response) => {
    const fields = getNotEmptyFields(req.body, ['userId']);
    const {templateId} = req.params;

    const result = await ExerciseService.updateExerciseTemplate(
        templateId,
        fields,
        req.body
    );
    HttpResponse.ok(res, result);
}));

exerciseController.get(urls.getMany, asyncMiddlewareWrapper(async (req: Request, res: Response) => {
    const {userId} = req.params;
    const {sportId} = req.query;

    const limitParameters = checkGetLimitParameters(req.query);
    const result = await ExerciseService.getUserExercises(limitParameters, userId, sportId);
    HttpResponse.ok(res, result);
}));

exerciseController.get(urls.get, asyncMiddlewareWrapper(async (req: Request, res: Response) => {
    const {exerciseId} = req.params;
    const result = await ExerciseService.getExerciseById(exerciseId);
    HttpResponse.ok(res, result);
}));

exerciseController.post(urls.create, asyncMiddlewareWrapper(async (req: Request, res: Response) => {
    const {exerciseTemplateId, duration, reps} = req.body;
    if (!exerciseTemplateId) {
        throw Boom.badRequest(HttpErrors.MISSING_PARAMS);
    }

    const result = await ExerciseService.createExercise({
        exerciseTemplateId, duration, reps
    });
    HttpResponse.ok(res, result);
}));

exerciseController.post(urls.update, asyncMiddlewareWrapper(async (req: Request, res: Response) => {
    const fields = getNotEmptyFields(req.body);
    const {exerciseId} = req.params;

    const result = await ExerciseService.updateExercise(
        exerciseId,
        fields,
        req.body
    );
    HttpResponse.ok(res, result);
}));

exerciseController.delete(urls.delete, asyncMiddlewareWrapper(async (req: Request, res: Response) => {
    const {exerciseId} = req.params;
    const result = await ExerciseService.deleteExercise(exerciseId);
    HttpResponse.ok(res, result);
}));

export default exerciseController;
