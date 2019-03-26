import express, {Request, Response} from 'express';

import CountryService from 'src/services/country';
import HttpResponse from 'src/utils/http/response';
import {checkGetLimitParameters, asyncMiddlewareWrapper} from 'src/utils';
import {apiUrls} from 'src/urls';

const controller = express();
const urls = apiUrls.country;

/**
 * @apiDoc
 * @type controller
 * @url country.getCountries
 * @method get
 * @returns CountryModel[]
 */
controller.get(urls.getCountries, asyncMiddlewareWrapper(async (_req: Request, res: Response) => {
    const result = await CountryService.getCountries();
    HttpResponse.ok(res, result);
}));

/**
 * @apiDoc
 * @type controller
 * @url country.getUsersByCountry
 * @method get
 * @query LimitQueryParams
 * @urlParams [[{
 *  "name": "countryId",
 *  "type": "number | null"
 * }]]
 * @returns UserModel[]
 */
controller.get(urls.getUsersByCountry, asyncMiddlewareWrapper(async (req: Request, res: Response) => {
    const limitParameters = await checkGetLimitParameters(req.query);
    let {countryId} = req.params;

    // if id === 'null' => will be returned users without countries
    if (countryId === 'null') {
        countryId = null;
    }

    const result = await CountryService.getUsers(limitParameters, countryId);
    HttpResponse.ok(res, result);
}));

export default controller;
