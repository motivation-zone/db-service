import * as express from 'express';
import CountryService from '../services/CountryService';
import HttpResponse from '../utils/http/HttpResponse';
import {checkGetLimitParameters} from '../utils/utils';

const countryController = express();

countryController.get('/get', async (req: express.Request, res: express.Response) => {
    try {
        const result = await CountryService.getCountries();
        HttpResponse[200](res, result);
    } catch (e) {
        HttpResponse[409](res, e.message);
    }
});

countryController.get('/get-users/:id', async (req: express.Request, res: express.Response) => {
    const limitParameters = checkGetLimitParameters(req.query);
    let {id} = req.params;
    if (id === 'null') {
        id = null;
    }

    if (!limitParameters) {
        HttpResponse[400](res);
        return;
    }

    try {
        const result = await CountryService.getUsers(limitParameters, id);
        HttpResponse[200](res, result);
    } catch (e) {
        HttpResponse[409](res, e.message);
    }
});

export default countryController;
