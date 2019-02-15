import * as express from 'express';

import {API_URLS} from '../urls';

const programController = express();
const urls = API_URLS.program;

programController.get(urls.get, async (req: express.Request, res: express.Response) => {

});

export default programController;
