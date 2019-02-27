import express from 'express';
import Boom from 'boom';

import SportService, {SPORT_USER_ACTION_TYPES} from 'src/services/sport';
import HttpResponse from 'src/utils/http/response';
import {checkGetLimitParameters, asyncMiddlewareWrapper} from 'src/utils';
import {API_URLS} from 'src/urls';
import HttpErrors from 'src/utils/http/errors';

const sportController = express();
const urls = API_URLS.sport;

sportController.get(urls.get, asyncMiddlewareWrapper(async (_req: express.Request, res: express.Response) => {
    const result = await SportService.getSports();
    HttpResponse.ok(res, result);
}));

sportController.get(urls.getUsers, asyncMiddlewareWrapper(async (req: express.Request, res: express.Response) => {
    const limitParameters = checkGetLimitParameters(req.query);
    const {id} = req.params;

    const result = await SportService.getUsers(limitParameters, id);
    HttpResponse.ok(res, result);
}));

sportController.post(urls.updateUserSport, asyncMiddlewareWrapper(
    async (req: express.Request, res: express.Response) => {
        const {userId, sportId} = req.body;
        const {actionType} = req.params;

        if (!userId || !sportId || SPORT_USER_ACTION_TYPES.includes(actionType)) {
            Boom.badRequest(HttpErrors.MISSING_PARAMS);
        }

        const result = await SportService.updateUser(actionType, userId, sportId);
        HttpResponse.ok(res, result);
    }
));

export default sportController;
