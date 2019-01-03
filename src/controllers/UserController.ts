import * as express from 'express';
import UserModel, {REQUIRED_FIELDS} from '../models/UserModel';
import UserService from '../services/UserService';
import HttpResponse from '../utils/http/HttpResponse';
import {stringToBoolean, checkNecessaryFields, checkGetLimitParameters} from '../utils/utils';

const userController = express();

userController.post('/create', async (req: express.Request, res: express.Response) => {
    const user = new UserModel(req.body);
    const isOk = checkNecessaryFields(REQUIRED_FIELDS, user);

    if (!isOk) {
        HttpResponse[400](res);
        return;
    }

    try {
        const result = await UserService.createUser(user);
        HttpResponse[200](res, result);
    } catch (e) {
        HttpResponse[409](res, e.message);
    }
});

userController.get('/get', async (req: express.Request, res: express.Response) => {
    const limitParameters = checkGetLimitParameters(req.query);
    if (!limitParameters) {
        HttpResponse[400](res);
        return;
    }

    try {
        const result = await UserService.getUsers(limitParameters);
        HttpResponse[200](res, result);
    } catch (e) {
        HttpResponse[409](res, e.message);
    }
});

userController.get('/get/id/:id', async (req: express.Request, res: express.Response) => {
    const {id} = req.params;

    try {
        const result = await UserService.getUserById(id);
        HttpResponse[200](res, result);
    } catch (e) {
        HttpResponse[409](res, e.message);
    }
});

userController.get('/get/login/:login', async (req: express.Request, res: express.Response) => {
    const {login} = req.params;
    const {strict} = req.query;

    try {
        const result = await UserService.getUserByLogin(login, stringToBoolean(strict));
        HttpResponse[200](res, result);
    } catch (e) {
        HttpResponse[409](res, e.message);
    }
});

userController.post('/update/:id', async (req: express.Request, res: express.Response) => {
    const {id} = req.params;
    const user = new UserModel(req.body);
    user.id = id;

    try {
        const result = await UserService.updateUser(user);
        HttpResponse[200](res, result);
    } catch (e) {
        HttpResponse[409](res, e.message);
    }
});

userController.post('/check/password', async (req: express.Request, res: express.Response) => {
    const {login, password} = req.body;

    try {
        const result = await UserService.checkUserPassword(login, password);
        HttpResponse[200](res, result);
    } catch (e) {
        HttpResponse[409](res, e.message);
    }
});

userController.delete('/delete/:id', async (req: express.Request, res: express.Response) => {
    const {id} = req.params;

    try {
        const result = await UserService.deleteUser(id);
        HttpResponse[200](res, result);
    } catch (e) {
        HttpResponse[409](res, e.message);
    }
});

export default userController;
