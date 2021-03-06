import Joi from 'joi';
import Boom from 'boom';

import HttpResponse from 'src/utils/http/response';
import {SPORT_USER_ACTION_TYPES} from 'src/services/sport';
import {joiValidationErrorToString} from 'src/utils';

/**
 * @api
 * @type model
 * @name LinkUserSportModel
 * @object {{
 *  "type": "object",
 *  "required": [
 *      "id",
 *      "userId",
 *      "sportId"
 *  ],
 *  "properties": [
 *      {
 *          "name": "id",
 *          "type": "number"
 *      }, {
 *          "name": "userId",
 *          "type": "string"
 *      }, {
 *          "name": "sportId",
 *          "type": "number"
 *      }
 *  ]
 * }}
 */
export interface ILinkUserSportModel {
    id?: number;
    userId?: string;
    sportId?: number;
}

const VALIDATION_SCHEMES = {
    userId: Joi.string().required(),
    sportId: Joi.number().required(),
    actionType: Joi.string().valid(SPORT_USER_ACTION_TYPES).required()
};

export default class LinkUserSportModel implements ILinkUserSportModel {
    public id?: number;
    public userId?: string;
    public sportId?: number;

    constructor(data: ILinkUserSportModel) {
        const {id, userId, sportId} = data;

        this.id = id;
        this.userId = userId;
        this.sportId = sportId;
    }

    async validateForCreate(actionType: any): Promise<void> {
        try {
            await Joi.validate({
                userId: this.userId,
                sportId: this.sportId,
                actionType
            }, VALIDATION_SCHEMES);
        } catch (e) {
            HttpResponse.throwError(Boom.badRequest, joiValidationErrorToString(e));
        }
    }
}
