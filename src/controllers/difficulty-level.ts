import * as express from 'express';
import {Request, Response} from 'express';

import DifficultyLevelService from '../services/difficulty-level';
import HttpResponse from '../utils/http/response';
import {API_URLS} from '../urls';

const difficultyLevelController = express();
const urls = API_URLS.difficultyLevel;

difficultyLevelController.get(urls.get, async (_req: Request, res: Response) => {
    const result = await DifficultyLevelService.getDifficultyLevels();
    HttpResponse.ok(res, result);
});

export default difficultyLevelController;
