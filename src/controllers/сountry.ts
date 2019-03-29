import express, {Request, Response} from 'express';

import CountryService from 'src/services/country';
import HttpResponse from 'src/utils/http/response';
import {checkGetLimitParameters, asyncMiddlewareWrapper} from 'src/utils';
import {apiUrls} from 'src/urls';

const controller = express();
const urls = apiUrls.country;

/**
 * @api
 * @type controller
 * @tag country
 * @url country.getCountries
 * @method get
 * @summary
 * @operationId country.getCountries
 * @parameters {[]}
 * @response {{
 *      "schema": "CountryModel",
 *      "type": "array"
 * }}
 */
controller.get(urls.getCountries, asyncMiddlewareWrapper(async (_req: Request, res: Response) => {
    const result = await CountryService.getCountries();
    HttpResponse.ok(res, result);
}));

/**
 * @api
 * @type controller
 * @tag country
 * @url country.getUsersByCountry
 * @method get
 * @operationId country.getUsersByCountry
 * @parameters {[
 *      {
 *          "in": "path",
 *          "name": "countryId",
 *          "required": true,
 *          "schema": {
 *          	"type": "string"
 *          }
 *      }, {
 *          "in": "query",
 *          "name": "order",
 *          "description": "sorting order [desc, asd]",
 *          "required": false,
 *          "schema": {
 *              "type": "string"
 *          }
 *      }, {
 *          "in": "query",
 *          "name": "limit",
 *          "required": true,
 *          "schema": {
 *              "type": "number"
 *          }
 *      }, {
 *          "in": "query",
 *          "name": "skip",
 *          "required": true,
 *          "schema": {
 *              "type": "number"
 *          }
 *      }
 * ]}
 * @response {{
 *      "schema": "UserModel",
 *      "type": "array"
 * }}
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
