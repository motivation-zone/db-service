import express, {Request, Response} from 'express';

import CountryService from 'src/services/country';
import HttpResponse from 'src/utils/http/response';
import {checkGetLimitParameters, asyncMiddlewareWrapper} from 'src/utils';
import {API_URLS} from 'src/urls';

const countryController = express();
const urls = API_URLS.country;

countryController.get(urls.get, asyncMiddlewareWrapper(async (_req: Request, res: Response) => {
    const result = await CountryService.getCountries();
    HttpResponse.ok(res, result);
}));

countryController.get(urls.getUsers, asyncMiddlewareWrapper(async (req: Request, res: Response) => {
    const limitParameters = await checkGetLimitParameters(req.query);
    let {countryId} = req.params;
    // if id === 'null' => will be returned users without countries

    if (countryId === 'null') {
        countryId = null;
    }

    const result = await CountryService.getUsers(limitParameters, countryId);
    HttpResponse.ok(res, result);
}));

export default countryController;
