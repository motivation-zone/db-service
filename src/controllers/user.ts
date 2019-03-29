import express, {Request, Response} from 'express';

import UserModel from 'src/models/user';
import UserService from 'src/services/user';
import HttpResponse from 'src/utils/http/response';
import {queryStringToBoolean, checkGetLimitParameters, asyncMiddlewareWrapper} from 'src/utils';
import {apiUrls} from 'src/urls';

const controller = express();
const urls = apiUrls.user;

/**
 * @api
 * @type controller
 * @tag user
 * @url user.createUser
 * @method post
 * @operationId user.createUser
 * @parameters {[
 *      {
 *          "in": "body",
 *          "name": "UserModel",
 *          "required": true,
 *          "schema": {
 *          	"ref": "UserModel"
 *          }
 *      }
 * ]}
 * @response {{
 *      "schema": "UserModel",
 *      "type": "array"
 * }}
 */
controller.post(urls.createUser, asyncMiddlewareWrapper(async (req: Request, res: Response) => {
    const user = new UserModel(req.body);
    await user.validateForCreate();

    const result = await UserService.createUser(user);
    HttpResponse.ok(res, result);
}));

/**
 * @api
 * @type controller
 * @tag user
 * @url user.getUsers
 * @method get
 * @operationId user.getUsers
 * @parameters {[
 *      {
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
controller.get(urls.getUsers, asyncMiddlewareWrapper(async (req: Request, res: Response) => {
    const limitParameters = await checkGetLimitParameters(req.query);
    const result = await UserService.getUsers(limitParameters);
    HttpResponse.ok(res, result);
}));

/**
 * @api
 * @type controller
 * @tag user
 * @url user.getUserById
 * @method get
 * @operationId user.getUserById
 * @parameters {[
 *      {
 *          "in": "path",
 *          "name": "userId",
 *          "required": true,
 *          "schema": {
 *              "type": "string"
 *          }
 *      }
 * ]}
 * @response {{
 *      "schema": "UserModel",
 *      "type": "array"
 * }}
 */
controller.get(urls.getUserById, asyncMiddlewareWrapper(async (req: Request, res: Response) => {
    const {userId} = req.params;
    const result = await UserService.getUserById(userId);
    HttpResponse.ok(res, result);
}));

/**
 * @api
 * @type controller
 * @tag user
 * @url user.getUserByLogin
 * @method get
 * @operationId user.getUserByLogin
 * @parameters {[
 *      {
 *          "in": "path",
 *          "name": "login",
 *          "required": true,
 *          "schema": {
 *              "type": "string"
 *          }
 *      }, {
 *          "in": "query",
 *          "name": "strict",
 *          "required": false,
 *          "schema": {
 *              "type": "boolean"
 *          }
 *      }
 * ]}
 * @response {{
 *      "schema": "UserModel",
 *      "type": "array"
 * }}
 */
controller.get(urls.getUserByLogin, asyncMiddlewareWrapper(async (req: Request, res: Response) => {
    const {login} = req.params;
    const {strict} = req.query;
    const result = await UserService.getUserByLogin(login, queryStringToBoolean(strict));
    HttpResponse.ok(res, result);
}));

/**
 * @api
 * @type controller
 * @tag user
 * @url user.updateUserById
 * @method post
 * @operationId user.updateUserById
 * @parameters {[
 *      {
 *          "in": "body",
 *          "name": "UserModel",
 *          "required": true,
 *          "schema": {
 *          	"ref": "UserModel"
 *          }
 *      }
 * ]}
 * @response {{
 *      "schema": "UserModel",
 *      "type": "array"
 * }}
 */
controller.post(urls.updateUserById, asyncMiddlewareWrapper(async (req: Request, res: Response) => {
    const {userId} = req.params;

    const user = new UserModel(req.body);
    user.clearNotUpdatedFields();

    const result = await UserService.updateUser(userId, user);
    HttpResponse.ok(res, result);
}));

/**
 * @api
 * @type controller
 * @tag user
 * @url user.checkUserPassword
 * @method post
 * @operationId user.checkUserPassword
 * @parameters {[
 *      {
 *          "in": "body",
 *          "name": "login",
 *          "required": true,
 *          "schema": {
 *          	"type": "string"
 *          }
 *      }, {
 *          "in": "body",
 *          "name": "password",
 *          "required": true,
 *          "schema": {
 *          	"type": "string"
 *          }
 *      }
 * ]}
 * @response {{
 *      "type": "boolean"
 * }}
 */
controller.post(urls.checkUserPassword, asyncMiddlewareWrapper(async (req: Request, res: Response) => {
    const {login, password} = req.body;
    const result = await UserService.checkUserPassword(login, password);
    HttpResponse.ok(res, result);
}));

/**
 * @api
 * @type controller
 * @tag user
 * @url user.deleteUserById
 * @method delete
 * @operationId user.deleteUserById
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
 *      "schema": "UserModel",
 *      "type": "array"
 * }}
 */
controller.delete(urls.deleteUserById, asyncMiddlewareWrapper(async (req: Request, res: Response) => {
    const {userId} = req.params;
    const result = await UserService.deleteUser(userId);
    HttpResponse.ok(res, result);
}));

export default controller;
