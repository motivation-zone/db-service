import Joi from 'joi';
import Boom from 'boom';

import HttpResponse from 'src/utils/http/response';

/**
 * @apiDoc
 * @type model
 * @name DifficultyLevelModel
 * @object [[{
 *  "name": "id",
 *  "type": "number"
 * }, {
 *  "name": "level",
 *  "type": "number"
 * }, {
 *  "name": "name",
 *  "type": "string"
 * }]]
 */
export interface IDifficultyLevelModel {
    id: number;
    level: number;
    name: string;
}

const VALIDATION_SCHEMES = Joi.object().keys({
    id: Joi.number().integer().required(),
    level: Joi.number().integer().required(),
    name: Joi.string().required()
});

export default class DifficultyLevelModel implements IDifficultyLevelModel {
    public id: number;
    public level: number;
    public name: string;

    constructor(data: IDifficultyLevelModel) {
        const {id, name, level} = data;

        this.id = id && Number(id);
        this.name = name;
        this.level = level && Number(level);
    }

    async validate(): Promise<void> {
        try {
            await Joi.validate(this, VALIDATION_SCHEMES);
        } catch (e) {
            HttpResponse.throwError(Boom.badRequest, e.details.message);
        }
    }
}
