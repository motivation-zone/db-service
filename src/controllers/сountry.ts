import * as express from 'express';
import {Request, Response} from 'express';

import CountryService from '../services/country';
import HttpResponse from '../utils/http/response';
import {checkGetLimitParameters} from '../utils';
import {API_URLS} from '../urls';

const countryController = express();
const urls = API_URLS.country;

countryController.get(urls.get, async (_req: Request, res: Response) => {
    const result = await CountryService.getCountries();
    HttpResponse.ok(res, result);
});

countryController.get(urls.getUsers, async (req: Request, res: Response) => {
    const limitParameters = checkGetLimitParameters(req.query);
    let {id} = req.params;
    if (id === 'null') {
        id = null;
    }

    const result = await CountryService.getUsers(limitParameters, id);
    HttpResponse.ok(res, result);
});

export default countryController;
