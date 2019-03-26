import Joi from 'joi';
import Boom from 'boom';

import HttpResponse from 'src/utils/http/response';
import {parseDate, joiValidationErrorToString} from 'src/utils';
import {IExerciseTemplateModel} from './exercise-template';

export enum ExerciseValueType {
    REPS = 'reps',
    DURATION = 'duration'
}

/**
 * @apiDoc
 * @type model
 * @name ExerciseModel
 * @object [[{
 *  "name": "id",
 *  "type": "number"
 * }, {
 *  "name": "exerciseTemplateId",
 *  "type": "string"
 * }, {
 *  "name": "value",
 *  "type": "number"
 * }, {
 *  "name": "type",
 *  "type": "reps | duration"
 * }, {
 *  "name": "createdDate",
 *  "type": "Date"
 * }, {
 *  "name": "exerciseTemplate",
 *  "type": "ExerciseTemplateModel"
 * }]]
 */

export interface IExerciseModel {
    id?: string;
    exerciseTemplateId?: string;
    value?: number;
    type?: ExerciseValueType;
    createdDate?: Date;

    exerciseTemplate?: IExerciseTemplateModel;
}

interface IExerciseModelParams extends IExerciseModel {
    tempId?: string;
    tempTitle?: string;
    tempDescription?: string;
    tempUserId?: string;
    tempSportId?: number;
    tempDifficultyLevelId?: number;
}

const VALIDATION_SCHEMES = Joi.object().keys({
    id: Joi.string(),
    exerciseTemplateId: Joi.string().required(),
    value: Joi.number().required(),
    type: Joi.string().valid([ExerciseValueType.REPS, ExerciseValueType.DURATION]).required(),
    createdDate: Joi.date(),
    exerciseTemplate: Joi.object().keys({
        id: Joi.string(),
        title: Joi.string(),
        description: Joi.string(),
        userId: Joi.string(),
        sportId: Joi.number(),
        difficultyLevelId: Joi.number()
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
            tempId, tempTitle, tempDescription, tempUserId,
            tempSportId, tempDifficultyLevelId
        } = data;

        this.id = id;
        this.exerciseTemplateId = exerciseTemplateId;
        this.value = value;
        this.type = type;
        this.createdDate = parseDate(createdDate);

        this.exerciseTemplate = {
            id: tempId,
            title: tempTitle,
            description: tempDescription,
            userId: tempUserId,
            sportId: tempSportId && Number(tempSportId),
            difficultyLevelId: tempDifficultyLevelId && Number(tempDifficultyLevelId)
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
