import {
    getTrainingTypes as getTrainingTypesQuery
} from 'src/query-creators/training-type';
import {query} from 'src/lib/db/client';
import {prepareDBResult} from 'src/services/base';

export default class TrainingTypeService {
    static async getTrainingTypes(): Promise<any[]> {
        const result = await query({
            text: getTrainingTypesQuery(),
            values: []
        });

        return prepareDBResult(result);
    }
}
