import Joi from 'joi';
import Boom from 'boom';

import HttpResponse from 'src/utils/http/response';
import {parseDate, joiValidationErrorToString} from 'src/utils';
import {IExerciseTemplateModel} from './exercise-template';

export enum ExerciseValueType {
    REPS = 'reps',
    DURATION = 'duration'
}

export interface IExerciseModel {
    id?: string;
    exerciseTemplateId?: string;
    value?: number;
    type?: ExerciseValueType;
    createdDate?: Date;

    exerciseTemplate?: IExerciseTemplateModel;
}

interface IExerciseModelParams extends IExerciseModel {
    tempTitle?: string;
    tempDescription?: string;
    tempUserId?: string;
    tempSportId?: number;
}

const VALIDATION_SCHEMES = Joi.object().keys({
    id: Joi.string(),
    exerciseTemplateId: Joi.string().required(),
    value: Joi.number().required(),
    type: Joi.string().valid([ExerciseValueType.REPS, ExerciseValueType.DURATION]).required(),
    createdDate: Joi.date(),
    exerciseTemplate: Joi.object().keys({
        title: Joi.string(),
        description: Joi.string(),
        userId: Joi.string(),
        sportId: Joi.number()
    })
});

export const NOT_UPDATED_FIELDS: (keyof IExerciseModel)[] = [
    'id', 'createdDate', 'exerciseTemplate'
];
export const REQUIRED_FIELDS: (keyof IExerciseModel)[] = ['exerciseTemplateId', 'value', 'type'];

export default class ExerciseModel implements IExerciseModel {
    public id?: string;
    public exerciseTemplateId?: string;
    public value?: number;
    public type?: ExerciseValueType;
    public createdDate?: Date;

    public exerciseTemplate?: IExerciseTemplateModel;

    constructor(data: IExerciseModelParams) {
        const {
            id, exerciseTemplateId, value, type, createdDate,
            tempTitle, tempDescription, tempUserId, tempSportId
        } = data;

        this.id = id;
        this.exerciseTemplateId = exerciseTemplateId;
        this.value = value;
        this.type = type;
        this.createdDate = parseDate(createdDate);

        this.exerciseTemplate = {
            title: tempTitle,
            description: tempDescription,
            userId: tempUserId,
            sportId: tempSportId && Number(tempSportId)
        };
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
