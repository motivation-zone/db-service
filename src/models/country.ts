import Joi from 'joi';
import Boom from 'boom';

import HttpResponse from 'src/utils/http/response';

/**
 * @api
 * @type model
 * @name CountryModel
 * @object {{
 *  "type": "object",
 *  "required": [
 *      "id",
 *      "name",
 *      "alpha2",
 *      "alpha3",
 *      "unCode"
 *  ],
 *  "properties": [{
 *      "name": "id",
 *      "type": "number"
 *  }, {
 *      "name": "name",
 *      "type": "string"
 *  }, {
 *      "name": "alpha2",
 *      "type": "string"
 *  }, {
 *      "name": "alpha3",
 *      "type": "string"
 *  }, {
 *      "name": "unCode",
 *      "type": "string"
 *  }]
 * }}
 */
export interface ICountryModel {
    id: number;
    name: string;
    alpha2: string;
    alpha3: string;
    unCode: string;
}

const VALIDATION_SCHEMES = Joi.object().keys({
    id: Joi.number().integer().required(),
    name: Joi.string().required(),
    alpha2: Joi.string().required(),
    alpha3: Joi.string().required(),
    unCode: Joi.string().required()
});

export default class CountryModel implements ICountryModel{
    public id: number;
    public name: string;
    public alpha2: string;
    public alpha3: string;
    public unCode: string;

    constructor(data: ICountryModel) {
        const {id, name, alpha2, alpha3, unCode} = data;

        this.id = id && Number(id);
        this.name = name;
        this.alpha2 = alpha2;
        this.alpha3 = alpha3;
        this.unCode = unCode;
    }

    async validate(): Promise<void> {
        try {
            await Joi.validate(this, VALIDATION_SCHEMES);
        } catch (e) {
            HttpResponse.throwError(Boom.badRequest, e.details.message);
        }
    }
}
