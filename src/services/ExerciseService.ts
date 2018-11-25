import {} from '../query-creators/exercise';
import {query} from '../lib/db/client';
import {prepareDBResult} from './base';

export default class ExerciseService {
    static async smth() {
        const result = await query({
            text: '',
            values: []
        });

        return prepareDBResult(result);
    }
};
