import express, {Request, Response} from 'express';

import DifficultyLevelService from 'src/services/difficulty-level';
import HttpResponse from 'src/utils/http/response';
import {apiUrls} from 'src/urls';
import {asyncMiddlewareWrapper} from 'src/utils';

const controller = express();
const urls = apiUrls.difficultyLevel;

/**
 * @apiDoc
 * @type controller
 * @url difficultyLevel.getDifficultyLevels
 * @method get
 * @returns DifficultyLevelModel[]
 */
controller.get(urls.getDifficultyLevels, asyncMiddlewareWrapper(async (_req: Request, res: Response) => {
    const result = await DifficultyLevelService.getDifficultyLevels();
    HttpResponse.ok(res, result);
}));

export default controller;
