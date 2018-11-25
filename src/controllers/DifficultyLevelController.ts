import * as express from 'express';
import DifficultyLevelService from '../services/DifficultyLevelService';
import HttpResponse from '../utils/http/HttpResponse';

const difficultyLevelController = express();

difficultyLevelController.get('/get', async (req: express.Request, res: express.Response) => {
    try {
        const result = await DifficultyLevelService.getDifficultyLevels();
        HttpResponse[200](res, result);
    } catch (e) {
        HttpResponse[409](res, e.message);
    }
});

export default difficultyLevelController;
