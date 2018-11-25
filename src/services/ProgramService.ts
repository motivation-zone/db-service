import {} from '../query-creators/program';
import {query} from '../lib/db/client';
import {prepareDBResult} from './base';

export default class ProgramService {
    static async smth() {
        const result = await query({
            text: '',
            values: []
        });

        return prepareDBResult(result);
    }
};
