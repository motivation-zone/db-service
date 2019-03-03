import {} from 'src/query-creators/program';
import {query} from 'src/lib/db/client';
import {prepareDBResult} from 'src/services/base';

export default class ProgramService {
    static async smth(): Promise<any[]> {
        const result = await query({
            text: '',
            values: []
        });

        return prepareDBResult(result);
    }
}
