import {
    getTrainingDurations as getTrainingDurationsQuery
} from '../query-creators/training-duration';
import {query} from '../lib/db/client';
import {prepareDBResult} from './base';

export default class TrainingDurationService {
    static async getTrainingDurations() {
        const result = await query({
            text: getTrainingDurationsQuery(),
            values: []
        });

        return prepareDBResult(result);
    }
};
