import * as express from 'express';
import SportService from '../services/SportService';
import HttpResponse from '../utils/HttpResponse';

const sportController = express();

sportController.get('/get', async (req: express.Request, res: express.Response) => {
    const result = await SportService.getSports();

    if (result.status === 'error') {
        HttpResponse[409](res, result.data.common);
        return;
    }

    HttpResponse[200](res, result.data);
});

sportController.post('/add-user', async (req: express.Request, res: express.Response) => {
    const {userId, sportId} = req.body;
    if (!userId || !sportId) {
        HttpResponse[400](res);
        return;
    }

    const result = await SportService.addUser(userId, sportId);

    if (result.status === 'error') {
        HttpResponse[409](res, result.data.common);
        return;
    }

    HttpResponse[200](res, result.data);
});

export default sportController;
