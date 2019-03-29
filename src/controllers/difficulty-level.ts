import express, {Request, Response} from 'express';

import DifficultyLevelService from 'src/services/difficulty-level';
import HttpResponse from 'src/utils/http/response';
import {apiUrls} from 'src/urls';
import {asyncMiddlewareWrapper} from 'src/utils';

const controller = express();
const urls = apiUrls.difficultyLevel;

/**
 * @api
 * @type controller
 * @tag difficulty-level
 * @url difficultyLevel.getDifficultyLevels
 * @method get
 * @operationId difficultyLevel.getDifficultyLevels
 * @parameters {[]}
 * @response {{
 *      "schema": "DifficultyLevelModel",
 *      "type": "array"
 * }}
 */
controller.get(urls.getDifficultyLevels, asyncMiddlewareWrapper(async (_req: Request, res: Response) => {
    const result = await DifficultyLevelService.getDifficultyLevels();
    HttpResponse.ok(res, result);
}));

export default controller;
