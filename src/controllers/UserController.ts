import * as express from 'express';
import UserModel, {REQUIRED_FIELDS} from '../models/UserModel';
import UserService from '../services/UserService';
import HttpResponse from '../utils/HttpResponse';
import {OrderType} from '../query-creators/base';
import {stringToBoolean, checkNecessaryFields, checkGetLimitParameters} from '../utils/utils';

const userController = express();

userController.post('/create', async (req: express.Request, res: express.Response) => {
    const user = new UserModel(req.body);
    const isOk = checkNecessaryFields(REQUIRED_FIELDS, user);

    if (!isOk) {
        HttpResponse[400](res);
        return;
    }

    const result = await UserService.createUser(user);
    if (result.status === 'error') {
        HttpResponse[409](res, result.data.common);
        return;
    }

    HttpResponse[201](res, result.data);
});

userController.get('/get', async (req: express.Request, res: express.Response) => {
    const limitParameters = checkGetLimitParameters(req.query);
    if (!limitParameters) {
        HttpResponse[400](res);
        return;
    }

    const result = await UserService.getUsers(limitParameters);

    if (result.status === 'error') {
        HttpResponse[409](res, result.data.common);
        return;
    }

    HttpResponse[200](res, result.data);
});

userController.get('/get/id/:id', async (req: express.Request, res: express.Response) => {
    const {id} = req.params;
    const result = await UserService.getUserById(id);

    if (result.status === 'error') {
        HttpResponse[409](res, result.data.common);
        return;
    }

    HttpResponse[200](res, result.data);
});

userController.get('/get/login/:login', async (req: express.Request, res: express.Response) => {
    const {login} = req.params;
    const {strict} = req.query;
    const result = await UserService.getUserByLogin(login, stringToBoolean(strict));

    if (result.status === 'error') {
        HttpResponse[409](res, result.data.common);
        return;
    }

    HttpResponse[200](res, result.data);
});

userController.post('/update/:id', async (req: express.Request, res: express.Response) => {
    const {id} = req.params;
    const user = new UserModel(req.body);
    user.id = id;

    const result = await UserService.updateUser(user);
    if (result.status === 'error') {
        HttpResponse[409](res, result.data.common);
        return;
    }

    HttpResponse[200](res, result.data);
});

userController.delete('/delete/:id', async (req: express.Request, res: express.Response) => {
    const {id} = req.params;

    const result = await UserService.deleteUser(id);
    if (result.status === 'error') {
        HttpResponse[409](res, result.data.common);
        return;
    }

    HttpResponse[200](res, result.data);
});

export default userController;
