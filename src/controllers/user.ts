import express, {Request, Response} from 'express';

import UserModel from '../models/user';
import UserService from '../services/user';
import HttpResponse from '../utils/http/response';
import {queryStringToBoolean, checkGetLimitParameters, asyncMiddlewareWrapper} from '../utils';
import {API_URLS} from '../urls';

const userController = express();
const urls = API_URLS.user;

userController.post(urls.create, asyncMiddlewareWrapper(async (req: Request, res: Response) => {
    const user = new UserModel(req.body);
    await user.validateForCreate();
    const result = await UserService.createUser(user);
    HttpResponse.ok(res, result);
}));

userController.get(urls.get, async (req: Request, res: Response) => {
    const limitParameters = checkGetLimitParameters(req.query);
    const result = await UserService.getUsers(limitParameters);
    HttpResponse.ok(res, result);
});

userController.get(urls.getById, async (req: Request, res: Response) => {
    const {id} = req.params;
    const result = await UserService.getUserById(id);
    HttpResponse.ok(res, result);
});

userController.get(urls.getByLogin, async (req: Request, res: Response) => {
    const {login} = req.params;
    const {strict} = req.query;
    const result = await UserService.getUserByLogin(login, queryStringToBoolean(strict));
    HttpResponse.ok(res, result);
});

userController.post(urls.updateById, async (req: Request, res: Response) => {
    const {id} = req.params;
    const user = new UserModel(req.body);
    user.clearNotUpdatedFields();
    user.id = id;

    const result = await UserService.updateUser(user);
    HttpResponse.ok(res, result);
});

userController.post(urls.checkPassword, async (req: Request, res: Response) => {
    const {login, password} = req.body;
    const result = await UserService.checkUserPassword(login, password);
    HttpResponse.ok(res, result);
});

userController.delete(urls.deleteById, async (req: Request, res: Response) => {
    const {id} = req.params;
    const result = await UserService.deleteUser(id);
    HttpResponse.ok(res, result);
});

export default userController;
