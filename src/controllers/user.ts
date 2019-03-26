import express, {Request, Response} from 'express';

import UserModel from 'src/models/user';
import UserService from 'src/services/user';
import HttpResponse from 'src/utils/http/response';
import {queryStringToBoolean, checkGetLimitParameters, asyncMiddlewareWrapper} from 'src/utils';
import {apiUrls} from 'src/urls';

const controller = express();
const urls = apiUrls.user;

/**
 * @apiDoc
 * @type controller
 * @url user.createUser
 * @method post
 * @body UserModel
 * @returns UserModel[]
 */
controller.post(urls.createUser, asyncMiddlewareWrapper(async (req: Request, res: Response) => {
    const user = new UserModel(req.body);
    await user.validateForCreate();

    const result = await UserService.createUser(user);
    HttpResponse.ok(res, result);
}));

/**
 * @apiDoc
 * @type controller
 * @url user.getUsers
 * @method get
 * @query LimitQueryParams
 * @returns UserModel[]
 */
controller.get(urls.getUsers, asyncMiddlewareWrapper(async (req: Request, res: Response) => {
    const limitParameters = await checkGetLimitParameters(req.query);
    const result = await UserService.getUsers(limitParameters);
    HttpResponse.ok(res, result);
}));

/**
 * @apiDoc
 * @type controller
 * @url user.getUserById
 * @method get
 * @returns UserModel[]
 */
controller.get(urls.getUserById, asyncMiddlewareWrapper(async (req: Request, res: Response) => {
    const {userId} = req.params;
    const result = await UserService.getUserById(userId);
    HttpResponse.ok(res, result);
}));

/**
 * @apiDoc
 * @type controller
 * @url user.getUserByLogin
 * @method get
 * @query [[{
 *  "name": "strict",
 *  "type": "boolean"
 * }]]
 * @returns UserModel[]
 */
controller.get(urls.getUserByLogin, asyncMiddlewareWrapper(async (req: Request, res: Response) => {
    const {login} = req.params;
    const {strict} = req.query;
    const result = await UserService.getUserByLogin(login, queryStringToBoolean(strict));
    HttpResponse.ok(res, result);
}));

/**
 * @apiDoc
 * @type controller
 * @url user.updateUserById
 * @method post
 * @body UserModel
 * @returns UserModel[]
 */
controller.post(urls.updateUserById, asyncMiddlewareWrapper(async (req: Request, res: Response) => {
    const {userId} = req.params;

    const user = new UserModel(req.body);
    user.clearNotUpdatedFields();

    const result = await UserService.updateUser(userId, user);
    HttpResponse.ok(res, result);
}));

/**
 * @apiDoc
 * @type controller
 * @url user.checkUserPassword
 * @method post
 * @body [[{
 *  "name": "login",
 *  "type": "string"
 * }, {
 *  "name": "password",
 *  "type": "string"
 * }]]
 * @returns [[{
 *  "name": "id",
 *  "type": "string"
 * }]]
 */
controller.post(urls.checkUserPassword, asyncMiddlewareWrapper(async (req: Request, res: Response) => {
    const {login, password} = req.body;
    const result = await UserService.checkUserPassword(login, password);
    HttpResponse.ok(res, result);
}));

/**
 * @apiDoc
 * @type controller
 * @url user.deleteUserById
 * @method delete
 * @returns UserModel[]
 */
controller.delete(urls.deleteUserById, asyncMiddlewareWrapper(async (req: Request, res: Response) => {
    const {userId} = req.params;
    const result = await UserService.deleteUser(userId);
    HttpResponse.ok(res, result);
}));

export default controller;
