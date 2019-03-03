import express, {Request, Response} from 'express';

import DifficultyLevelService from 'src/services/difficulty-level';
import HttpResponse from 'src/utils/http/response';
import {API_URLS} from 'src/urls';
import {asyncMiddlewareWrapper} from 'src/utils';

const difficultyLevelController = express();
const urls = API_URLS.difficultyLevel;

difficultyLevelController.get(urls.get, asyncMiddlewareWrapper(async (_req: Request, res: Response) => {
    const result = await DifficultyLevelService.getDifficultyLevels();
    HttpResponse.ok(res, result);
}));

export default difficultyLevelController;
