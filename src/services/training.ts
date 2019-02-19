import {} from '../query-creators/training';
import {query} from '../lib/db/client';
import {prepareDBResult} from './base';

export default class TrainingService {
    static async smth(): Promise<any[]> {
        const result = await query({
            text: '',
            values: []
        });

        return prepareDBResult(result);
    }
}
