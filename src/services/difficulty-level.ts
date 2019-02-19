import {
    getDifficultyLevels as getDifficultyLevelsQuery
} from '../query-creators/difficulty-level';
import {query} from '../lib/db/client';
import {prepareDBResult} from './base';

export default class DifficultyLevelService {
    static async getDifficultyLevels(): Promise<any[]> {
        const result = await query({
            text: getDifficultyLevelsQuery(),
            values: []
        });

        return prepareDBResult(result);
    }
}
