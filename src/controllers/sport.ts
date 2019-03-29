import express, {Request, Response} from 'express';

import SportService from 'src/services/sport';
import HttpResponse from 'src/utils/http/response';
import {checkGetLimitParameters, asyncMiddlewareWrapper} from 'src/utils';
import {apiUrls} from 'src/urls';
import LinkUserSportModel from 'src/models/link/user-sport';

const controller = express();
const urls = apiUrls.sport;

/**
 * @api
 * @type controller
 * @tag sport
 * @url sport.getSports
 * @method get
 * @operationId sport.getSports
 * @parameters {[]}
 * @response {{
 *      "schema": "SportModel",
 *      "type": "array"
 * }}
 */
controller.get(urls.getSports, asyncMiddlewareWrapper(async (_req: Request, res: Response) => {
    const result = await SportService.getSports();
    HttpResponse.ok(res, result);
}));

/**
 * @api
 * @type controller
 * @tag sport
 * @url sport.getUsersBySport
 * @method get
 * @operationId sport.getUsersBySport
 * @parameters {[
 *      {
 *          "in": "path",
 *          "name": "sportId",
 *          "required": true,
 *          "schema": {
 *  	        "type": "string"
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
 *      "schema": "UserModel",
 *      "type": "array"
 * }}
 */
controller.get(urls.getUsersBySport, asyncMiddlewareWrapper(async (req: Request, res: Response) => {
    const limitParameters = await checkGetLimitParameters(req.query);
    const {sportId} = req.params;

    const result = await SportService.getUsers(limitParameters, sportId);
    HttpResponse.ok(res, result);
}));

/**
 * @api
 * @type controller
 * @tag sport
 * @url sport.getUserSports
 * @method get
 * @operationId sport.getUserSports
 * @parameters {[
 *      {
 *          "in": "path",
 *          "name": "userId",
 *          "required": true,
 *          "schema": {
 *          	"type": "string"
 *          }
 *      }
 * ]}
 * @response {{
 *      "schema": "SportModel",
 *      "type": "array"
 * }}
 */
controller.get(urls.getUserSports, asyncMiddlewareWrapper(async (req: Request, res: Response) => {
    const {userId} = req.params;

    const result = await SportService.getUserSports(userId);
    HttpResponse.ok(res, result);
}));

/**
 * @api
 * @type controller
 * @tag sport
 * @url sport.updateUserSport
 * @method post
 * @operationId sport.updateUserSport
 * @parameters {[
 *      {
 *          "in": "body",
 *          "name": "LinkUserSportModel",
 *          "required": true,
 *          "schema": {
 *          	"ref": "LinkUserSportModel"
 *          }
 *      }
 * ]}
 * @response {{
 *      "schema": "LinkUserSportModel",
 *      "type": "array"
 * }}
 */
controller.post(urls.updateUserSport, asyncMiddlewareWrapper(async (req: Request, res: Response) => {
    const {actionType} = req.params;

    const userSport = new LinkUserSportModel(req.body);
    await userSport.validateForCreate(actionType);

    const result = await SportService.updateUser(actionType, userSport);
    HttpResponse.ok(res, result);
}));

export default controller;
