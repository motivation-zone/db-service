import * as express from 'express';
import SportService, { SPORT_USER_ACTION_TYPES } from '../services/SportService';
import HttpResponse from '../utils/http/HttpResponse';
import {checkGetLimitParameters} from '../utils/utils';

const sportController = express();

sportController.get('/get', async (req: express.Request, res: express.Response) => {
    try {
        const result = await SportService.getSports();
        HttpResponse[200](res, result);
    } catch (e) {
        HttpResponse[409](res, e.message);
    }
});

sportController.get('/get-users/:id', async (req: express.Request, res: express.Response) => {
    const limitParameters = checkGetLimitParameters(req.query);
    const {id} = req.params;

    if (!limitParameters) {
        HttpResponse[400](res);
        return;
    }

    try {
        const result = await SportService.getUsers(limitParameters, id);
        HttpResponse[200](res, result);
    } catch (e) {
        HttpResponse[409](res, e.message);
    }
});

sportController.post('/update-user/:type', async (req: express.Request, res: express.Response) => {
    const {userId, sportId} = req.body;
    const {type} = req.params;

    if (!userId || !sportId || SPORT_USER_ACTION_TYPES.indexOf(type) === -1) {
        HttpResponse[400](res);
        return;
    }

    try {
        const result = await SportService.updateUser(type, userId, sportId);
        HttpResponse[200](res, result);
    } catch (e) {
        HttpResponse[409](res, e.message);
    }
});

export default sportController;
