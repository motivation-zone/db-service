import {query} from 'src/lib/db/client';
import {prepareDBResult, IGetLimit} from 'src/services/base';
import {
    createExerciseTemplate as createExerciseTemplateQuery,
    updateExerciseTemplate as updateExerciseTemplateQuery,
    getUserExerciseTemplatesBySport as getUserExerciseTemplatesBySportQuery,
    getAllUserExerciseTemplates as getAllUserExerciseTemplatesQuery,
    deleteExerciseTemplate as deleteExerciseTemplateQuery,
    getExerciseTemplateById as getExerciseTemplateByIdQuery
} from 'src/query-creators/exercise-template';
import {translateNodeToPostgresqlName} from 'src/utils/db/helper';
import ExerciseTemplateModel, {IExerciseTemplateModel} from 'src/models/exercise-template';
import {getNotEmptyFields} from 'src/utils';

export default class ExerciseService {
    static async createExerciseTemplate(template: IExerciseTemplateModel): Promise<any[]> {
        const {title, description, userId, sportId} = template;
        const result = await query({
            text: createExerciseTemplateQuery(),
            values: [title, description, userId, sportId]
        });

        return prepareDBResult(result);
    }

    static async updateExerciseTemplate(templateId: number, template: ExerciseTemplateModel): Promise<any[]> {
        const fields = getNotEmptyFields(template) as (keyof IExerciseTemplateModel)[];
        const result = await query({
            text: updateExerciseTemplateQuery(fields.map(translateNodeToPostgresqlName)),
            values: [
                templateId,
                ...fields.map((field) => template[field])
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
}
