import express, {Request, Response} from 'express';

import UserModel from 'src/models/user';
import UserService from 'src/services/user';
import HttpResponse from 'src/utils/http/response';
import {queryStringToBoolean, checkGetLimitParameters, asyncMiddlewareWrapper} from 'src/utils';
import {API_URLS} from 'src/urls';

const userController = express();
const urls = API_URLS.user;

userController.post(urls.create, asyncMiddlewareWrapper(async (req: Request, res: Response) => {
    const user = new UserModel(req.body);
    await user.validateForCreate();
    const result = await UserService.createUser(user);
    HttpResponse.ok(res, result);
}));

userController.get(urls.get, asyncMiddlewareWrapper(async (req: Request, res: Response) => {
    const limitParameters = await checkGetLimitParameters(req.query);
    const result = await UserService.getUsers(limitParameters);
    HttpResponse.ok(res, result);
}));

userController.get(urls.getById, asyncMiddlewareWrapper(async (req: Request, res: Response) => {
    const {id} = req.params;
    const result = await UserService.getUserById(id);
    HttpResponse.ok(res, result);
}));

userController.get(urls.getByLogin, asyncMiddlewareWrapper(async (req: Request, res: Response) => {
    const {login} = req.params;
    const {strict} = req.query;
    const result = await UserService.getUserByLogin(login, queryStringToBoolean(strict));
    HttpResponse.ok(res, result);
}));

userController.post(urls.updateById, asyncMiddlewareWrapper(async (req: Request, res: Response) => {
    const {id} = req.params;
    const user = new UserModel(req.body);
    user.clearNotUpdatedFields();
    user.id = id;

    const result = await UserService.updateUser(user);
    HttpResponse.ok(res, result);
}));

userController.post(urls.checkPassword, asyncMiddlewareWrapper(async (req: Request, res: Response) => {
    const {login, password} = req.body;
    const result = await UserService.checkUserPassword(login, password);
    HttpResponse.ok(res, result);
}));

userController.delete(urls.deleteById, asyncMiddlewareWrapper(async (req: Request, res: Response) => {
    const {id} = req.params;
    const result = await UserService.deleteUser(id);
    HttpResponse.ok(res, result);
}));

export default userController;
