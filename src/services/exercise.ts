import {query} from 'src/lib/db/client';
import {prepareDBResult, IGetLimit} from 'src/services/base';
import {
    createExercise as createExerciseQuery,
    updateExercise as updateExerciseQuery,
    getExerciseById as getExerciseByIdQuery,
    getUserExercises as getUserExercisesQuery,
    deleteExercise as deleteExerciseQuery
} from 'src/query-creators/exercise';
import {translateNodeToPostgresqlName, createDbWhereText} from 'src/utils/db/helper';
import {IExerciseModel} from 'src/models/exercise';
import {createMapData, getNotEmptyFields} from 'src/utils';

export default class ExerciseService {
    static async createExercise(exercise: IExerciseModel): Promise<any[]> {
        const {type, value, exerciseTemplateId} = exercise;
        const fields = createMapData(['type', 'value'], [type, value]);
        const result = await query({
            text: createExerciseQuery(fields.map((f) => f.name)),
            values: [exerciseTemplateId].concat(fields.map((f) => f.value))
        });

        return prepareDBResult(result);
    }

    static async updateExercise(exerciseId: string, exercise: IExerciseModel): Promise<any[]> {
        const fields = getNotEmptyFields(exercise) as (keyof IExerciseModel)[];
        const result = await query({
            text: updateExerciseQuery(fields.map(translateNodeToPostgresqlName)),
            values: [
                exerciseId,
                ...fields.map((field) => exercise[field])
            ]
        });

        return prepareDBResult(result);
    }

    static async getExerciseById(exerciseId: string): Promise<any[]> {
        const result = await query({
            text: getExerciseByIdQuery(),
            values: [exerciseId]
        });

        return prepareDBResult(result);
    }

    static async getUserExercises(
        limitParams: IGetLimit,
        userId: number,
        params: {sportId?: number, templateId?: string, difficultyLevelId?: number}
    ): Promise<any[]> {
        const {sportId, templateId, difficultyLevelId} = params;

        const fields = createMapData(
            [
                'exerciseTemplate.sportId',
                'exercise.exerciseTemplateId',
                'exerciseTemplate.difficultyLevelId'
            ],
            [sportId, templateId, difficultyLevelId]
        );

        const whereText = createDbWhereText(fields.map((x) => translateNodeToPostgresqlName(x.name)), 4);
        const result = await query({
            text: getUserExercisesQuery(
                limitParams.order,
                whereText
            ),
            values: [userId, limitParams.limit, limitParams.skip, ...fields.map((x) => x.value)]
        });

        return prepareDBResult(result);
    }

    static async deleteExercise(exerciseId: string): Promise<any[]> {
        const result = await query({
            text: deleteExerciseQuery(),
            values: [exerciseId]
        });

        return prepareDBResult(result);
    }
}
