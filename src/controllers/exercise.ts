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

/**
 * @api
 * @type controller
 * @tag exercise
 * @url exercise.getUserExercises
 * @method get
 * @operationId exercise.getUserExercises
 * @parameters {[
 *      {
 *          "in": "path",
 *          "name": "userId",
 *          "required": true,
 *          "schema": {
 *              "type": "string"
 *          }
 *      }, {
 *          "in": "query",
 *          "name": "sportId",
 *          "required": false,
 *          "schema": {
 *              "type": "number"
 *          }
 *      }, {
 *          "in": "query",
 *          "name": "templateId",
 *          "required": false,
 *          "schema": {
 *              "type": "string"
 *          }
 *      }, {
 *          "in": "query",
 *          "name": "difficultyLevelId",
 *          "required": false,
 *          "schema": {
 *              "type": "number"
 *          }
 *      }, {
 *          "in": "query",
 *          "name": "order",
 *          "description": "sorting order [desc, asd]",
 *          "required": false,
 *          "schema": {
 *              "type": "string"
 *          }
 *      }, {
 *          "in": "query",
 *          "name": "limit",
 *          "required": true,
 *          "schema": {
 *              "type": "number"
 *          }
 *      }, {
 *          "in": "query",
 *          "name": "skip",
 *          "required": true,
 *          "schema": {
 *              "type": "number"
 *          }
 *      }
 * ]}
 * @response {{
 *      "schema": "ExerciseModel",
 *      "type": "array"
 * }}
 */
controller.get(urls.getUserExercises, asyncMiddlewareWrapper(async (req: Request, res: Response) => {
    const {userId} = req.params;
    const {sportId, templateId, difficultyLevelId} = req.query;

    const limitParameters = await checkGetLimitParameters(req.query);
    const result = await ExerciseService.getUserExercises(
        limitParameters,
        userId,
        {sportId, templateId, difficultyLevelId}
    );
    HttpResponse.ok(res, result);
}));

/**
 * @api
 * @type controller
 * @tag exercise
 * @url exercise.createExercise
 * @method post
 * @operationId exercise.createExercise
 * @parameters {[
 *      {
 *          "in": "body",
 *          "name": "ExerciseModel",
 *          "required": true,
 *          "schema": {
 *          	"ref": "ExerciseModel"
 *          }
 *      }
 * ]}
 * @response {{
 *      "schema": "ExerciseModel",
 *      "type": "array"
 * }}
 */
controller.post(urls.createExercise, asyncMiddlewareWrapper(async (req: Request, res: Response) => {
    const exercise = new ExerciseModel(req.body);
    await exercise.validateForCreate();

    const result = await ExerciseService.createExercise(exercise);
    HttpResponse.ok(res, result);
}));

/**
 * @api
 * @type controller
 * @tag exercise
 * @url exercise.getExerciseById
 * @method get
 * @operationId exercise.getExerciseById
 * @parameters {[
 *      {
 *          "in": "path",
 *          "name": "exerciseId",
 *          "required": true,
 *          "schema": {
 *              "type": "string"
 *          }
 *      }
 * ]}
 * @response {{
 *      "schema": "ExerciseModel",
 *      "type": "array"
 * }}
 */
controller.get(urls.getExerciseById, asyncMiddlewareWrapper(async (req: Request, res: Response) => {
    const {exerciseId} = req.params;
    const result = await ExerciseService.getExerciseById(exerciseId);
    HttpResponse.ok(res, result);
}));

/**
 * @api
 * @type controller
 * @tag exercise
 * @url exercise.updateExerciseById
 * @method post
 * @operationId exercise.updateExerciseById
 * @parameters {[
 *      {
 *          "in": "path",
 *          "name": "exerciseId",
 *          "required": true,
 *          "schema": {
 *          	"type": "string"
 *          }
 *      }, {
 *          "in": "body",
 *          "name": "ExerciseModel",
 *          "required": true,
 *          "schema": {
 *          	"ref": "ExerciseModel"
 *          }
 *      }
 * ]}
 * @response {{
 *      "schema": "ExerciseModel",
 *      "type": "array"
 * }}
 */
controller.post(urls.updateExerciseById, asyncMiddlewareWrapper(async (req: Request, res: Response) => {
    const {exerciseId} = req.params;

    const exercise = new ExerciseModel(req.body);
    exercise.clearNotUpdatedFields();

    const result = await ExerciseService.updateExercise(exerciseId, exercise);
    HttpResponse.ok(res, result);
}));

/**
 * @api
 * @type controller
 * @tag exercise
 * @url exercise.deleteExerciseById
 * @method delete
 * @operationId exercise.deleteExerciseById
 * @parameters {[
 *      {
 *          "in": "path",
 *          "name": "exerciseId",
 *          "required": true,
 *          "schema": {
 *          	"type": "string"
 *          }
 *      }
 * ]}
 * @response {{
 *      "schema": "ExerciseModel",
 *      "type": "array"
 * }}
 */
controller.delete(urls.deleteExerciseById, asyncMiddlewareWrapper(async (req: Request, res: Response) => {
    const {exerciseId} = req.params;
    const result = await ExerciseService.deleteExercise(exerciseId);
    HttpResponse.ok(res, result);
}));

export default controller;
