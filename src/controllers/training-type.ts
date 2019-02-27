import express from 'express';

import TrainingTypeService from 'src/services/training-type';
import HttpResponse from 'src/utils/http/response';
import {API_URLS} from 'src/urls';
import {asyncMiddlewareWrapper} from 'src/utils';

const trainingTypeController = express();
const urls = API_URLS.trainingType;

trainingTypeController.get(urls.get, asyncMiddlewareWrapper(async (_req: express.Request, res: express.Response) => {
    const result = await TrainingTypeService.getTrainingTypes();
    HttpResponse.ok(res, result);
}));

export default trainingTypeController;
