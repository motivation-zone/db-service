import express from 'express';

import {API_URLS} from '../urls';

const programController = express();
const urls = API_URLS.program;

programController.get(urls.get, async (_req: express.Request, _res: express.Response) => {});

export default programController;
