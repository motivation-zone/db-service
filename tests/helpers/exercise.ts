import faker from 'faker';

import {apiUrls} from 'src/urls';
import ExerciseModel, {IExerciseModel, ExerciseValueType} from 'src/models/exercise';
import {IGetLimitTest} from 'tests/utils';
import {formQueryString, intervalRandom} from 'src/utils';
import {getRequest, postRequest, deleteRequest} from 'tests/helpers/common';

const urls = apiUrls.exercise;
const EXERCISE_ID = ':exerciseId';

interface IGetExercisesParams {
    limitParams: IGetLimitTest;
    userId?: string;
    sportId?: number;
    templateId?: string;
}

const insertExercise = async (exercise: IExerciseModel) => {
    return await postRequest<IExerciseModel>({
        url: `${urls.prefix}${urls.createExercise}`,
        ModelClass: ExerciseModel,
        data: exercise
    });
};

const getUserExercises = async ({userId, sportId, templateId, limitParams}: IGetExercisesParams) => {
    const url = [
        `${urls.prefix}${urls.getUserExercises}`.replace(':userId', userId!),
        `?${formQueryString({
            ...limitParams,
            templateId,
            sportId
        })}`
    ].join('');

    return await getRequest<IExerciseModel>({
        url,
        ModelClass: ExerciseModel
    });
};

const getExercise = async (exerciseId: string) => {
    return await getRequest<IExerciseModel>({
        url: `${urls.prefix}${urls.getExerciseById}`.replace(EXERCISE_ID, exerciseId),
        ModelClass: ExerciseModel
    });
};

const updateExercise = async (exerciseId: string, exercise: IExerciseModel) => {
    return await postRequest<IExerciseModel>({
        url: `${urls.prefix}${urls.updateExerciseById}`.replace(EXERCISE_ID, exerciseId),
        ModelClass: ExerciseModel,
        data: exercise
    });
};

const deleteExercise = async (exerciseId: string) => {
    return await deleteRequest<IExerciseModel>({
        url: `${urls.prefix}${urls.deleteExerciseById}`.replace(EXERCISE_ID, exerciseId),
        ModelClass: ExerciseModel
    });
};

export const dbActions = {
    insertExercise,
    getUserExercises,
    getExercise,
    updateExercise,
    deleteExercise
};

export const generateExercise = (templateId: string): IExerciseModel => {
    const {random} = faker;
    const types = [ExerciseValueType.DURATION, ExerciseValueType.REPS];

    return new ExerciseModel({
        exerciseTemplateId: templateId,
        value: random.number(),
        type: types[intervalRandom(0, types.length - 1)]
    });
};
