import * as express from 'express';
import TrainingDurationService from '../services/TrainingDurationService';
import HttpResponse from '../utils/http/HttpResponse';

const difficultyLevelController = express();

difficultyLevelController.get('/get', async (req: express.Request, res: express.Response) => {
    try {
        const result = await TrainingDurationService.getTrainingDurations();
        HttpResponse[200](res, result);
    } catch (e) {
        HttpResponse[409](res, e.message);
    }
});

export default difficultyLevelController;
