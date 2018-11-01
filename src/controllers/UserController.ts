import * as express from 'express';
import UserModel from '../models/UserModel';
import UserService from '../services/UserService';
import HttpResponse from '../utils/HttpResponse';
import {OrderType} from '../query-creators/base';
const userController = express();

userController.post('/create', async (req: express.Request, res: express.Response) => {
    const user = new UserModel();
    if (!user.formUserForCreate(req.body)) {
        HttpResponse.send(res, 400);
        return;
    }

    const result = await UserService.createUser(user);
    if (result.status === 'error') {
        const status = result.data ? 409 : 500;
        HttpResponse.send(res, status, result.data);
        return;
    }

    HttpResponse.send(res, 200, result.data);
});

userController.get('/get', async (req: express.Request, res: express.Response) => {
    const {limit, skip, order} = req.query;
    const orderTypes: OrderType[] = ['DESC', 'ASC'];
    if (!limit || !skip || order && !orderTypes.includes(order)) {
        HttpResponse.send(res, 400);
        return;
    }

    const result = await UserService.getUsers(limit, skip, order);

    if (result.status === 'error') {
        HttpResponse.send(res, 500, result.data);
        return;
    }

    HttpResponse.send(res, 200, result.data);
});

userController.get('/get/id/:id', async (req: express.Request, res: express.Response) => {
    const {id} = req.params;
    const result = await UserService.getUserById(id);

    if (result.status === 'error') {
        HttpResponse.send(res, 500, result.data);
        return;
    }

    HttpResponse.send(res, 200, result.data);
});

userController.get('/get/login/:login', async (req: express.Request, res: express.Response) => {
    const {login} = req.params;
    const {isStrict} = req.query;
    const result = await UserService.getUserByLogin(login, Boolean(isStrict));

    if (result.status === 'error') {
        HttpResponse.send(res, 500, result.data);
        return;
    }

    HttpResponse.send(res, 200, result.data);
});

userController.post('/update/:id', async (req: express.Request, res: express.Response) => {
    const {id} = req.params;
    const user = new UserModel();

    if (!user.formUser(req.body)) {
        HttpResponse.send(res, 400);
        return;
    }

    user.id = id;
    const result = await UserService.updateUser(user);
    if (result.status === 'error') {
        const status = result.data ? 409 : 500;
        HttpResponse.send(res, status, result.data);
        return;
    }

    HttpResponse.send(res, 200, result.data);
});

userController.delete('/delete/:id', async (req: express.Request, res: express.Response) => {
    const {id} = req.params;

    const result = await UserService.deleteUser(id);
    if (result.status === 'error') {
        HttpResponse.send(res, 409, result.data);
        return;
    }

    HttpResponse.send(res, 200, result.data);
});

export default userController;
