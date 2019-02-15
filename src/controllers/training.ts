import * as express from 'express';

import {API_URLS} from '../urls';

const trainingController = express();
const urls = API_URLS.training;

trainingController.get(urls.get, async (req: express.Request, res: express.Response) => {

});

export default trainingController;
