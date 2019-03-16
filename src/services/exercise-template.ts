import {query} from 'src/lib/db/client';
import {prepareDBResult, IGetLimit} from 'src/services/base';
import {
    createExerciseTemplate as createExerciseTemplateQuery,
    updateExerciseTemplate as updateExerciseTemplateQuery,
    getUserExerciseTemplates as getUserExerciseTemplatesQuery,
    deleteExerciseTemplate as deleteExerciseTemplateQuery,
    getExerciseTemplateById as getExerciseTemplateByIdQuery,
    IGetUserExerciseTemplatesQuery
} from 'src/query-creators/exercise-template';
import {translateNodeToPostgresqlName} from 'src/utils/db/helper';
import ExerciseTemplateModel, {IExerciseTemplateModel} from 'src/models/exercise-template';
import {getNotEmptyFields, createMapData} from 'src/utils';

export default class ExerciseService {
    static async createExerciseTemplate(template: IExerciseTemplateModel): Promise<any[]> {
        const {title, description, userId, sportId, difficultyLevelId} = template;
        const result = await query({
            text: createExerciseTemplateQuery(),
            values: [title, description, userId, sportId, difficultyLevelId]
        });

        return prepareDBResult(result);
    }

    static async updateExerciseTemplate(templateId: string, template: ExerciseTemplateModel): Promise<any[]> {
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

    static async getUserExerciseTemplates(
        limitParams: IGetLimit,
        params: {userId: string, sportId?: number, difficultyLevelId?: number}
    ): Promise<any[]> {
        const {userId, sportId, difficultyLevelId} = params;
        const fields = createMapData(
            ['sportId', 'difficultyLevelId'],
            [sportId, difficultyLevelId]
        );

        const result = await query({
            text: getUserExerciseTemplatesQuery(
                limitParams.order,
                fields.map((x) => x.name) as (keyof IGetUserExerciseTemplatesQuery)[]
            ),
            values: [userId, limitParams.limit, limitParams.skip, ...fields.map((x) => x.value)]
        });

        return prepareDBResult(result);
    }

    static async getExerciseTemplate(templateId: string): Promise<any[]> {
        const result = await query({
            text: getExerciseTemplateByIdQuery(),
            values: [templateId]
        });

        return prepareDBResult(result);
    }

    static async deleteExerciseTemplate(templateId: string): Promise<any[]> {
        const result = await query({
            text: deleteExerciseTemplateQuery(),
            values: [templateId]
        });

        return prepareDBResult(result);
    }
}
