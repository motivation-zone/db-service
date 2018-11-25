import * as express from 'express';
import ExerciseService from '../services/ExerciseService';
import HttpResponse from '../utils/http/HttpResponse';

const exerciseController = express();

exerciseController.get('/get', async (req: express.Request, res: express.Response) => {
    /* try {
        const result = await TrainingService.getDifficultyLevels();
        HttpResponse[200](res, result);
    } catch (e) {
        HttpResponse[409](res, e.message);
    } */
});

export default exerciseController;
