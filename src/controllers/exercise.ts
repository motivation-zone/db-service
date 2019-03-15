import express, {Request, Response} from 'express';

import ExerciseService from 'src/services/exercise';
import HttpResponse from 'src/utils/http/response';
import {
    checkGetLimitParameters,
    asyncMiddlewareWrapper
} from 'src/utils';
import {apiUrls} from 'src/urls';
import ExerciseModel from 'src/models/exercise';

const controller = express();
const urls = apiUrls.exercise;

controller.get(urls.getUserExercises, asyncMiddlewareWrapper(async (req: Request, res: Response) => {
    const {userId} = req.params;
    const {sportId, templateId} = req.query;

    const limitParameters = await checkGetLimitParameters(req.query);
    const result = await ExerciseService.getUserExercises(limitParameters, userId, {sportId, templateId});
    HttpResponse.ok(res, result);
}));

controller.post(urls.createExercise, asyncMiddlewareWrapper(async (req: Request, res: Response) => {
    const exercise = new ExerciseModel(req.body);
    await exercise.validateForCreate();

    const result = await ExerciseService.createExercise(exercise);
    HttpResponse.ok(res, result);
}));

controller.get(urls.getExerciseById, asyncMiddlewareWrapper(async (req: Request, res: Response) => {
    const {exerciseId} = req.params;
    const result = await ExerciseService.getExerciseById(exerciseId);
    HttpResponse.ok(res, result);
}));

controller.post(urls.updateExerciseById, asyncMiddlewareWrapper(async (req: Request, res: Response) => {
    const {exerciseId} = req.params;

    const exercise = new ExerciseModel(req.body);
    exercise.clearNotUpdatedFields();

    const result = await ExerciseService.updateExercise(exerciseId, exercise);
    HttpResponse.ok(res, result);
}));

controller.delete(urls.deleteExerciseById, asyncMiddlewareWrapper(async (req: Request, res: Response) => {
    const {exerciseId} = req.params;
    const result = await ExerciseService.deleteExercise(exerciseId);
    HttpResponse.ok(res, result);
}));

export default controller;
