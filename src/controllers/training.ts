import * as express from 'express';

import {API_URLS} from '../urls';

const trainingController = express();
const urls = API_URLS.training;

trainingController.get(urls.get, async (_req: express.Request, _res: express.Response) => {});

export default trainingController;
