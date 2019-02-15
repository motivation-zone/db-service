import * as express from 'express';

import TrainingTypeService from '../services/training-type';
import HttpResponse from '../utils/http/response';
import {API_URLS} from '../urls';

const trainingTypeController = express();
const urls = API_URLS.trainingType;

trainingTypeController.get(urls.get, async (_req: express.Request, res: express.Response) => {
    const result = await TrainingTypeService.getTrainingTypes();
    HttpResponse.ok(res, result);
});

export default trainingTypeController;
