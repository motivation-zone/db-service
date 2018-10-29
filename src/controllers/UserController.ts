import * as express from 'express';
const userController = express();

userController.post('/:login/create', () => {

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
