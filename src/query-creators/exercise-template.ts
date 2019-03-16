import {OrderType, updateQuery} from 'src/query-creators/base';

export const createExerciseTemplate = () => {
    return `
        INSERT INTO exercise_template (
            title, description, user_id, sport_id, difficulty_level_id
        ) VALUES (
            $1, $2, $3, $4, $5
        ) RETURNING *
    `;
};

export const updateExerciseTemplate = (fields: string[]) => updateQuery(fields, 'exercise_template');
export const deleteExerciseTemplate = () => 'DELETE FROM exercise_template WHERE id = $1 RETURNING *';
export const getExerciseTemplateById = () => 'SELECT * FROM exercise_template WHERE id = $1';

export interface IGetUserExerciseTemplatesQuery {
    sportId: string;
    difficultyLevelId: string;
}

export const getUserExerciseTemplates = (order: OrderType, fieldsKeys: (keyof IGetUserExerciseTemplatesQuery)[]) => {
    const table: IGetUserExerciseTemplatesQuery = {
        sportId: 'sport_id',
        difficultyLevelId: 'difficulty_level_id'
    };

    const fields = fieldsKeys.map((key) => table[key]).map((field, i) => `${field}=$${i + 4}`).join(' AND ');
    return `
        SELECT * FROM exercise_template
        WHERE user_id = $1 ${fields && `AND ${fields}`}
        ORDER BY created_date ${order}
        LIMIT $2 OFFSET $3
    `;
};
