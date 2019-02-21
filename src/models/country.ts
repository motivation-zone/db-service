import * as yup from 'yup';
import Boom from 'boom';

import HttpResponse from '../utils/http/response';
import HttpErrors from '../utils/http/errors';

export interface ICountryModel {
    id: number;
    name: string;
    alpha2: string;
    alpha3: string;
    unCode: string;
}

const VALIDATION_SCHEMES = {
    id: yup.number().required(),
    name: yup.string().required(),
    alpha2: yup.string().required(),
    alpha3: yup.string().required(),
    unCode: yup.string().required()
};

export default class CountryModel {
    public id: number;
    public name: string;
    public alpha2: string;
    public alpha3: string;
    public unCode: string;

    constructor(data: any) {
        const {id, name, alpha2, alpha3, unCode} = data;

        this.id = id;
        this.name = name;
        this.alpha2 = alpha2;
        this.alpha3 = alpha3;
        this.unCode = unCode;
    }

    async validate(): Promise<void> {
        const schema = yup.object().shape(VALIDATION_SCHEMES);
        const isValid = await schema.isValid(this);
        if (!isValid) {
            throw HttpResponse.error(Boom.badRequest, HttpErrors.MISSING_PARAMS);
        }
    }
}
