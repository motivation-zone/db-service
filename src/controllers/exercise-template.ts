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

/**
 * @api
 * @type controller
 * @tag exercise-template
 * @url exerciseTemplate.getUserExerciseTemplates
 * @method get
 * @operationId exerciseTemplate.getUserExerciseTemplates
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
 *      "schema": "ExerciseTemplateModel",
 *      "type": "array"
 * }}
 */
controller.get(urls.getUserExerciseTemplates, asyncMiddlewareWrapper(async (req: Request, res: Response) => {
    const {userId} = req.params;
    const {sportId, difficultyLevelId} = req.query;

    const limitParameters = await checkGetLimitParameters(req.query);
    const result = await ExerciseTemplateService.getUserExerciseTemplates(
        limitParameters,
        {userId, sportId, difficultyLevelId}
    );
    HttpResponse.ok(res, result);
}));

/**
 * @api
 * @type controller
 * @tag exercise-template
 * @url exerciseTemplate.createExerciseTemplate
 * @method post
 * @operationId exerciseTemplate.createExerciseTemplate
 * @parameters {[
 *      {
 *          "in": "body",
 *          "name": "ExerciseTemplateModel",
 *          "required": true,
 *          "schema": {
 *          	"ref": "ExerciseTemplateModel"
 *          }
 *      }
 * ]}
 * @response {{
 *      "schema": "ExerciseTemplateModel",
 *      "type": "array"
 * }}
 */
controller.post(urls.createExerciseTemplate, asyncMiddlewareWrapper(async (req: Request, res: Response) => {
    const exerciseTemplate = new ExerciseTemplateModel(req.body);
    await exerciseTemplate.validateForCreate();
    const result = await ExerciseTemplateService.createExerciseTemplate(exerciseTemplate);
    HttpResponse.ok(res, result);
}));

/**
 * @api
 * @type controller
 * @tag exercise-template
 * @url exerciseTemplate.getExerciseTemplateById
 * @method get
 * @operationId exerciseTemplate.getExerciseTemplateById
 * @parameters {[
 *      {
 *          "in": "path",
 *          "name": "templateId",
 *          "required": true,
 *          "schema": {
 *              "type": "string"
 *          }
 *      }
 * ]}
 * @response {{
 *      "schema": "ExerciseTemplateModel",
 *      "type": "array"
 * }}
 */
controller.get(urls.getExerciseTemplateById, asyncMiddlewareWrapper(async (req: Request, res: Response) => {
    const {templateId} = req.params;
    const result = await ExerciseTemplateService.getExerciseTemplate(templateId);
    HttpResponse.ok(res, result);
}));

/**
 * @api
 * @type controller
 * @tag exercise-template
 * @url exerciseTemplate.updateExerciseTemplateById
 * @method post
 * @operationId exerciseTemplate.updateExerciseTemplateById
 * @parameters {[
 *      {
 *          "in": "path",
 *          "name": "templateId",
 *          "required": true,
 *          "schema": {
 *          	"type": "string"
 *          }
 *      }, {
 *          "in": "body",
 *          "name": "ExerciseTemplateModel",
 *          "required": true,
 *          "schema": {
 *          	"ref": "ExerciseTemplateModel"
 *          }
 *      }
 * ]}
 * @response {{
 *      "schema": "ExerciseTemplateModel",
 *      "type": "array"
 * }}
 */
controller.post(urls.updateExerciseTemplateById, asyncMiddlewareWrapper(async (req: Request, res: Response) => {
    const {templateId} = req.params;
    const template = new ExerciseTemplateModel(req.body);
    template.clearNotUpdatedFields();

    const result = await ExerciseTemplateService.updateExerciseTemplate(templateId, template);
    HttpResponse.ok(res, result);
}));

/**
 * @api
 * @type controller
 * @tag exercise-template
 * @url exerciseTemplate.deleteExerciseTemplateById
 * @method delete
 * @operationId exerciseTemplate.deleteExerciseTemplateById
 * @parameters {[
 *      {
 *          "in": "path",
 *          "name": "templateId",
 *          "required": true,
 *          "schema": {
 *          	"type": "string"
 *          }
 *      }
 * ]}
 * @response {{
 *      "schema": "ExerciseTemplateModel",
 *      "type": "array"
 * }}
 */
controller.delete(urls.deleteExerciseTemplateById, asyncMiddlewareWrapper(async (req: Request, res: Response) => {
    const {templateId} = req.params;
    const result = await ExerciseTemplateService.deleteExerciseTemplate(templateId);
    HttpResponse.ok(res, result);
}));

export default controller;
