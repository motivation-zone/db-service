import express, {Request, Response} from 'express';
import Boom from 'boom';
import Joi from 'joi';

import ExerciseService from 'src/services/exercise';
import HttpResponse from 'src/utils/http/response';
import {getNotEmptyFields, checkGetLimitParameters, asyncMiddlewareWrapper} from 'src/utils';
import {API_URLS} from 'src/urls';

const exerciseController = express();
const urls = API_URLS.exercise;

exerciseController.get(urls.template.getMany, asyncMiddlewareWrapper(async (req: Request, res: Response) => {
    const {userId} = req.params;
    const {sportId} = req.query;

    const limitParameters = await checkGetLimitParameters(req.query);
    const result = await ExerciseService.getUserExerciseTemplates(limitParameters, userId, sportId);
    HttpResponse.ok(res, result);
}));

exerciseController.post(urls.template.create, asyncMiddlewareWrapper(async (req: Request, res: Response) => {
    const schema = {
        title: Joi.string().required(),
        description: Joi.string().required(),
        userId: Joi.number().required(),
        sportId: Joi.number().required()
    };

    try {
        const data = await Joi.validate(req.body, schema);
        const result = await ExerciseService.createExerciseTemplate(data);
        HttpResponse.ok(res, result);
    } catch (e) {
        if (!e.details) {
            throw e;
        }

        HttpResponse.throwError(Boom.badRequest, e.details.map((d: any) => d.message).join(', '));
    }
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

    const limitParameters = await checkGetLimitParameters(req.query);
    const result = await ExerciseService.getUserExercises(limitParameters, userId, sportId);
    HttpResponse.ok(res, result);
}));

exerciseController.get(urls.get, asyncMiddlewareWrapper(async (req: Request, res: Response) => {
    const {exerciseId} = req.params;
    const result = await ExerciseService.getExerciseById(exerciseId);
    HttpResponse.ok(res, result);
}));

exerciseController.post(urls.create, asyncMiddlewareWrapper(async (req: Request, res: Response) => {
    const schema = {
        exerciseTemplateId: Joi.number().required()
    };

    try {
        await Joi.validate(req.body, schema);
    } catch (e) {
        HttpResponse.throwError(Boom.badRequest, e.details.map((d: any) => d.message).join(', '));
    }

    const {exerciseTemplateId, duration, reps} = req.body;
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
