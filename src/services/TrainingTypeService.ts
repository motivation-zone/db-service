import {
    getTrainingTypes as getTrainingTypesQuery
} from '../query-creators/training-type';
import {query} from '../lib/db/client';
import {prepareDBResult} from './base';

export default class TrainingTypeService {
    static async getTrainingTypes() {
        const result = await query({
            text: getTrainingTypesQuery(),
            values: []
        });

        return prepareDBResult(result);
    }
};
