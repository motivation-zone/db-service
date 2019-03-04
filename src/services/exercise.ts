import {query} from 'src/lib/db/client';
import {prepareDBResult, IGetLimit} from 'src/services/base';
import {
    createExercise as createExerciseQuery,
    updateExercise as updateExerciseQuery,
    getExerciseById as getExerciseByIdQuery,
    getUserExercisesBySport as getUserExercisesBySportQuery,
    getAllUserExercises as getAllUserExercisesQuery,
    deleteExercise as deleteExerciseQuery
} from 'src/query-creators/exercise';
import {translateNodeToPostgresqlName} from 'src/utils/db/helper';
import {createMapData} from 'src/utils';

interface IExercise {
    exerciseTemplateId: number;
    duration?: number;
    reps?: number;
}

export default class ExerciseService {
    static async createExercise(params: IExercise): Promise<any[]> {
        const {duration, reps, exerciseTemplateId} = params;
        const fields = createMapData(['duration', 'reps'], [duration, reps]);

        const result = await query({
            text: createExerciseQuery(fields.map((f) => f.name)),
            values: [exerciseTemplateId].concat(fields.map((f) => f.value))
        });

        return prepareDBResult(result);
    }

    static async updateExercise(exerciseId: number, fields: string[], obj: any): Promise<any[]> {
        const result = await query({
            text: updateExerciseQuery(fields.map(translateNodeToPostgresqlName)),
            values: [
                exerciseId,
                ...fields.map((field) => obj[field])
            ]
        });

        return prepareDBResult(result);
    }

    static async getExerciseById(exerciseId: number): Promise<any[]> {
        const result = await query({
            text: getExerciseByIdQuery(),
            values: [exerciseId]
        });

        return prepareDBResult(result);
    }

    static async getUserExercises(limitParams: IGetLimit, userId: number, sportId?: number): Promise<any[]> {
        const result = await query({
            text: sportId ?
                getUserExercisesBySportQuery(limitParams.order) :
                getAllUserExercisesQuery(limitParams.order),
            values: [userId]
                .concat(sportId ? [sportId] : [])
                .concat([limitParams.limit, limitParams.skip])
        });

        return prepareDBResult(result);
    }

    static async deleteExercise(exerciseId: number): Promise<any[]> {
        const result = await query({
            text: deleteExerciseQuery(),
            values: [exerciseId]
        });

        return prepareDBResult(result);
    }
}
