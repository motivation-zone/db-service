import Joi from 'joi';
import Boom from 'boom';

import HttpResponse from 'src/utils/http/response';
import {parseDate, joiValidationErrorToString} from 'src/utils';

export interface IExerciseTemplateModel {
    id?: string;
    title?: string;
    description?: string;
    userId?: string;
    sportId?: number;
    createdDate?: Date;
}

const VALIDATION_SCHEMES = Joi.object().keys({
    id: Joi.string(),
    title: Joi.string().required(),
    description: Joi.string().required(),
    userId: Joi.string().required(),
    sportId: Joi.number().required(),
    createdDate: Joi.date()
});

export const NOT_UPDATED_FIELDS: (keyof IExerciseTemplateModel)[] = ['id', 'userId', 'createdDate'];
export const REQUIRED_FIELDS: (keyof IExerciseTemplateModel)[] = ['title', 'description', 'userId', 'sportId'];

export default class ExerciseTemplateModel implements IExerciseTemplateModel {
    public id?: string;
    public title?: string;
    public description?: string;
    public userId?: string;
    public sportId?: number;
    public createdDate?: Date;

    constructor(data: IExerciseTemplateModel) {
        const {id, title, description, userId, sportId, createdDate} = data;

        this.id = id;
        this.title = title;
        this.description = description;
        this.userId = userId;
        this.sportId = sportId && Number(sportId);
        this.createdDate = parseDate(createdDate);
    }

    async validateForCreate(): Promise<void> {
        try {
            await Joi.validate(this, VALIDATION_SCHEMES);
        } catch (e) {
            HttpResponse.throwError(Boom.badRequest, joiValidationErrorToString(e));
        }
    }

    clearNotUpdatedFields(): void {
        NOT_UPDATED_FIELDS.forEach((field) => delete this[field]);
    }
}
