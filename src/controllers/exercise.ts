import express, {Request, Response} from 'express';
import Boom from 'boom';
import Joi from 'joi';

import ExerciseService from 'src/services/exercise';
import HttpResponse from 'src/utils/http/response';
import {
    getNotEmptyFields,
    checkGetLimitParameters,
    asyncMiddlewareWrapper,
    joiValidationErrorToString
} from 'src/utils';
import {API_URLS} from 'src/urls';

const exerciseController = express();
const urls = API_URLS.exercise;

exerciseController.get(urls.get, asyncMiddlewareWrapper(async (req: Request, res: Response) => {
    const {userId} = req.params;
    const {sportId} = req.query;

    const limitParameters = await checkGetLimitParameters(req.query);
    const result = await ExerciseService.getUserExercises(limitParameters, userId, sportId);
    HttpResponse.ok(res, result);
}));

exerciseController.get(urls.getById, asyncMiddlewareWrapper(async (req: Request, res: Response) => {
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
        HttpResponse.throwError(Boom.badRequest, joiValidationErrorToString(e));
    }

    const {exerciseTemplateId, duration, reps} = req.body;
    const result = await ExerciseService.createExercise({
        exerciseTemplateId, duration, reps
    });
    HttpResponse.ok(res, result);
}));

exerciseController.post(urls.updateById, asyncMiddlewareWrapper(async (req: Request, res: Response) => {
    const fields = getNotEmptyFields(req.body);
    const {exerciseId} = req.params;

    const result = await ExerciseService.updateExercise(
        exerciseId,
        fields,
        req.body
    );
    HttpResponse.ok(res, result);
}));

exerciseController.delete(urls.deleteById, asyncMiddlewareWrapper(async (req: Request, res: Response) => {
    const {exerciseId} = req.params;
    const result = await ExerciseService.deleteExercise(exerciseId);
    HttpResponse.ok(res, result);
}));

export default exerciseController;
