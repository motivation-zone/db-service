import express, {Request, Response} from 'express';

import SportService from 'src/services/sport';
import HttpResponse from 'src/utils/http/response';
import {checkGetLimitParameters, asyncMiddlewareWrapper} from 'src/utils';
import {apiUrls} from 'src/urls';
import LinkUserSportModel from 'src/models/link/user-sport';

const controller = express();
const urls = apiUrls.sport;

/**
 * @apiDoc
 * @type controller
 * @url sport.getSports
 * @method get
 * @returns SportModel[]
 */
controller.get(urls.getSports, asyncMiddlewareWrapper(async (_req: Request, res: Response) => {
    const result = await SportService.getSports();
    HttpResponse.ok(res, result);
}));

/**
 * @apiDoc
 * @type controller
 * @url sport.getUsersBySport
 * @method get
 * @query LimitQueryParams
 * @returns UserModel[]
 */
controller.get(urls.getUsersBySport, asyncMiddlewareWrapper(async (req: Request, res: Response) => {
    const limitParameters = await checkGetLimitParameters(req.query);
    const {sportId} = req.params;

    const result = await SportService.getUsers(limitParameters, sportId);
    HttpResponse.ok(res, result);
}));

/**
 * @apiDoc
 * @type controller
 * @url sport.getUserSports
 * @method get
 * @returns SportModel[]
 */
controller.get(urls.getUserSports, asyncMiddlewareWrapper(async (req: Request, res: Response) => {
    const {userId} = req.params;

    const result = await SportService.getUserSports(userId);
    HttpResponse.ok(res, result);
}));

/**
 * @apiDoc
 * @type controller
 * @url sport.updateUserSport
 * @method post
 * @body LinkUserSportModel
 * @returns LinkUserSportModel[]
 */
controller.post(urls.updateUserSport, asyncMiddlewareWrapper(async (req: Request, res: Response) => {
    const {actionType} = req.params;

    const userSport = new LinkUserSportModel(req.body);
    await userSport.validateForCreate(actionType);

    const result = await SportService.updateUser(actionType, userSport);
    HttpResponse.ok(res, result);
}));

export default controller;
