import * as express from 'express';
import UserModel from '../models/UserModel';
import UserService from '../services/UserService';
import HttpResponse, { ErrorCode } from '../utils/HttpResponse';
import {OrderType} from '../query-creators/base';
import {stringToBoolean} from '../utils/utils';
const userController = express();

userController.post('/create', async (req: express.Request, res: express.Response) => {
    const user = new UserModel();
    const errMessage = user.formUserForCreate(req.body);
    if (errMessage) {
        HttpResponse.send(res, 400, {
            code: errMessage
        });
        return;
    }

    const result = await UserService.createUser(user);
    if (result.status === 'error') {
        HttpResponse.send(res, 409, {
            code: ErrorCode.DB_LEVEL_ERROR,
            message: result.data.common
        });
        return;
    }

    HttpResponse.send(res, 200, {
        data: result.data
    });
});

userController.get('/get', async (req: express.Request, res: express.Response) => {
    const {limit, skip, order} = req.query;
    const orderTypes: OrderType[] = ['DESC', 'ASC'];
    if (!limit || !skip || order && !orderTypes.includes(order.toUpperCase())) {
        HttpResponse.send(res, 400, {
            code: ErrorCode.REQUIRED_FIELDS
        });
        return;
    }

    const result = await UserService.getUsers(limit, skip, order);

    if (result.status === 'error') {
        HttpResponse.send(res, 409, {
            code: ErrorCode.DB_LEVEL_ERROR,
            message: result.data.common
        });
        return;
    }

    HttpResponse.send(res, 200, {
        data: result.data
    });
});

userController.get('/get/id/:id', async (req: express.Request, res: express.Response) => {
    const {id} = req.params;
    const result = await UserService.getUserById(id);

    if (result.status === 'error') {
        HttpResponse.send(res, 409, {
            code: ErrorCode.DB_LEVEL_ERROR,
            message: result.data.common
        });
        return;
    }

    HttpResponse.send(res, 200, {
        data: result.data
    });
});

userController.get('/get/login/:login', async (req: express.Request, res: express.Response) => {
    const {login} = req.params;
    const {strict} = req.query;
    const result = await UserService.getUserByLogin(login, stringToBoolean(strict));

    if (result.status === 'error') {
        HttpResponse.send(res, 409, {
            code: ErrorCode.DB_LEVEL_ERROR,
            message: result.data.common
        });
        return;
    }

    HttpResponse.send(res, 200, {
        data: result.data
    });
});

userController.post('/update/:id', async (req: express.Request, res: express.Response) => {
    const {id} = req.params;
    const user = new UserModel();

    const errMessage = user.formUser(req.body);
    if (errMessage) {
        HttpResponse.send(res, 400, {
            code: errMessage
        });
        return;
    }

    user.id = id;
    const result = await UserService.updateUser(user);
    if (result.status === 'error') {
        HttpResponse.send(res, 409, {
            code: ErrorCode.DB_LEVEL_ERROR,
            message: result.data.common
        });
        return;
    }

    HttpResponse.send(res, 200, {
        data: result.data
    });
});

userController.delete('/delete/:id', async (req: express.Request, res: express.Response) => {
    const {id} = req.params;

    const result = await UserService.deleteUser(id);
    if (result.status === 'error') {
        HttpResponse.send(res, 409, {
            code: ErrorCode.DB_LEVEL_ERROR,
            message: result.data.common
        });
        return;
    }

    HttpResponse.send(res, 200, {
        data: result.data
    });
});

export default userController;
