import {query} from '../lib/db/client';
import {prepareDBResult, IGetLimit} from './base';
import {
    createExerciseTemplate as createExerciseTemplateQuery,
    updateExerciseTemplate as updateExerciseTemplateQuery,
    getUserExerciseTemplatesBySport as getUserExerciseTemplatesBySportQuery,
    getAllUserExerciseTemplates as getAllUserExerciseTemplatesQuery,
    deleteExerciseTemplate as deleteExerciseTemplateQuery,
    getExerciseTemplateById as getExerciseTemplateByIdQuery,
    createExercise as createExerciseQuery,
    updateExercise as updateExerciseQuery,
    getExerciseById as getExerciseByIdQuery,
    getUserExercisesBySport as getUserExercisesBySportQuery,
    getAllUserExercises as getAllUserExercisesQuery,
    deleteExercise as deleteExerciseQuery
} from '../query-creators/exercise';
import {translateNodeToPostgresqlName} from '../utils/db/helper';
import {filterMapData} from '../utils';

interface IExercise {
    exerciseTemplateId: number;
    duration?: number;
    reps?: number;
}

interface IExerciseTemplate {
    title: string;
    description: string;
    userId: number;
    sportId: number;
}

export default class ExerciseService {
    static async createExerciseTemplate(params: IExerciseTemplate): Promise<any[]> {
        const {title, description, userId, sportId} = params;
        const result = await query({
            text: createExerciseTemplateQuery(),
            values: [title, description, userId, sportId]
        });

        return prepareDBResult(result);
    }

    static async updateExerciseTemplate(templateId: number, fields: string[], obj: any): Promise<any[]> {
        const result = await query({
            text: updateExerciseTemplateQuery(fields.map(translateNodeToPostgresqlName)),
            values: [
                templateId,
                ...fields.map((field) => obj[field])
            ]
        });

        return prepareDBResult(result);
    }

    static async getUserExerciseTemplates(limitParams: IGetLimit, userId: number, sportId?: number): Promise<any[]> {
        const result = await query({
            text: sportId ?
                getUserExerciseTemplatesBySportQuery(limitParams.order) :
                getAllUserExerciseTemplatesQuery(limitParams.order),
            values: [userId]
                .concat(sportId ? [sportId] : [])
                .concat([limitParams.limit, limitParams.skip])
        });

        return prepareDBResult(result);
    }

    static async getExerciseTemplate(templateId: number): Promise<any[]> {
        const result = await query({
            text: getExerciseTemplateByIdQuery(),
            values: [templateId]
        });

        return prepareDBResult(result);
    }

    static async deleteExerciseTemplate(templateId: number): Promise<any[]> {
        const result = await query({
            text: deleteExerciseTemplateQuery(),
            values: [templateId]
        });

        return prepareDBResult(result);
    }

    static async createExercise(params: IExercise): Promise<any[]> {
        const {duration, reps, exerciseTemplateId} = params;
        const fields = filterMapData(['duration', 'reps'], [duration, reps]);

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
