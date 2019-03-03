import {
    getDifficultyLevels as getDifficultyLevelsQuery
} from 'src/query-creators/difficulty-level';
import {query} from 'src/lib/db/client';
import {prepareDBResult} from 'src/services/base';

export default class DifficultyLevelService {
    static async getDifficultyLevels(): Promise<any[]> {
        const result = await query({
            text: getDifficultyLevelsQuery(),
            values: []
        });

        return prepareDBResult(result);
    }
}
