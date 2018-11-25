import * as express from 'express';
import ProgramService from '../services/ProgramService';
import HttpResponse from '../utils/http/HttpResponse';

const programController = express();

programController.get('/get', async (req: express.Request, res: express.Response) => {
    /* try {
        const result = await TrainingService.getDifficultyLevels();
        HttpResponse[200](res, result);
    } catch (e) {
        HttpResponse[409](res, e.message);
    } */
});

export default programController;
