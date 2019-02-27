import express from 'express';

import {API_URLS} from 'src/urls';
import {asyncMiddlewareWrapper} from 'src/utils';

const programController = express();
const urls = API_URLS.program;

programController.get(urls.get, asyncMiddlewareWrapper(async (_req: express.Request, _res: express.Response) => {}));

export default programController;
