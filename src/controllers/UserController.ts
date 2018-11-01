import * as express from 'express';
import UserModel from '../models/UserModel';
import UserService from '../services/UserService';
import HttpResponse from '../utils/HttpResponse';
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
        HttpResponse.send(res, status, {data: result.data});
        return;
    }

    HttpResponse.send(res, 200, result.data);
});

userController.get('/get', async (req: express.Request, res: express.Response) => {
    const {limit, skip, isDesc} = req.query;
    const result = await UserService.getUsers(limit, skip, isDesc);

    // HttpResponse.send(res, result.status, result.data);
});

userController.get('/get/id/:id', async (req: express.Request, res: express.Response) => {
    const {id} = req.params;
    const result = await UserService.getUserById(id);

    // HttpResponse.send(res, result.status, result.data);
});

userController.get('/get/login/:login', async (req: express.Request, res: express.Response) => {
    const {login} = req.params;
    const result = await UserService.getUserByLogin(login);

    // HttpResponse.send(res, result.status, result.data);
});

userController.post('/update/:id', async (req: express.Request, res: express.Response) => {
    const {id} = req.params;
    const user = new UserModel();
    // user.formByRequestBody(req.body);
    user.id = id;

    const result = await UserService.updateUser(user);

    // HttpResponse.send(res, result.status, result.data);
});

userController.delete('/delete/:id', async (req: express.Request, res: express.Response) => {
    const {id} = req.params;

    const result = await UserService.deleteUser(id);

    // HttpResponse.send(res, result.status, result.data);
});

export default userController;
