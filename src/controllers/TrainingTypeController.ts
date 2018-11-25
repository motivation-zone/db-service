import * as express from 'express';
import TrainingTypeService from '../services/TrainingTypeService';
import HttpResponse from '../utils/http/HttpResponse';

const trainingTypeController = express();

trainingTypeController.get('/get', async (req: express.Request, res: express.Response) => {
    try {
        const result = await TrainingTypeService.getTrainingTypes();
        HttpResponse[200](res, result);
    } catch (e) {
        HttpResponse[409](res, e.message);
    }
});

export default trainingTypeController;
