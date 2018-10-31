import * as express from 'express';
import UserModel from '../models/UserModel';
import UserService from '../services/UserService';
import HttpResponse from '../utils/HttpResponse';
const userController = express();

userController.post('/:login/create', async (req: express.Request, res: express.Response) => {
    req.body.login = req.params.login;
    const user = new UserModel(req.body);
    const result = await UserService.createUser(user);

    HttpResponse.send(res, result.status, result.data);
});

userController.get('/get', () => {
    // limit skip
});

userController.get('/get/:id', () => {

});

userController.get('/get/:login', () => {

});

userController.post('/update/:id', () => {

});

userController.delete('/delete/:id', () => {

});

export default userController;
