import {} from 'src/query-creators/training';
import {query} from 'src/lib/db/client';
import {prepareDBResult} from 'src/services/base';

export default class TrainingService {
    static async smth(): Promise<any[]> {
        const result = await query({
            text: '',
            values: []
        });

        return prepareDBResult(result);
    }
}
