import * as express from 'express';
import CountryService from '../services/CountryService';
import HttpResponse from '../utils/HttpResponse';
import {checkGetLimitParameters} from '../utils/utils';

const countryController = express();

countryController.get('/get', async (req: express.Request, res: express.Response) => {
    const result = await CountryService.getCountries();

    if (result.status === 'error') {
        HttpResponse[409](res, result.data.common);
        return;
    }

    HttpResponse[200](res, result.data);
});

countryController.get('/get-users/:id', async (req: express.Request, res: express.Response) => {
    const limitParameters = checkGetLimitParameters(req.query);
    const {id} = req.params;

    if (!limitParameters) {
        HttpResponse[400](res);
        return;
    }

    const result = await CountryService.getUsers(limitParameters, id);
    if (result.status === 'error') {
        HttpResponse[409](res, result.data.common);
        return;
    }

    HttpResponse[200](res, result.data);
});

countryController.post('/add-user', async (req: express.Request, res: express.Response) => {
    const {userId, countryId} = req.body;
    if (!userId || !countryId) {
        HttpResponse[400](res);
        return;
    }

    const result = await CountryService.addUser(userId, countryId);

    if (result.status === 'error') {
        HttpResponse[409](res, result.data.common);
        return;
    }

    HttpResponse[200](res, result.data);
});

export default countryController;
