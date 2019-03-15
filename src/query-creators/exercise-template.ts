import {OrderType, updateQuery} from 'src/query-creators/base';

export const createExerciseTemplate = () => {
    return `
        INSERT INTO exercise_template (
            title, description, user_id, sport_id
        ) VALUES (
            $1, $2, $3, $4
        ) RETURNING *
    `;
};

export const updateExerciseTemplate = (fields: string[]) => updateQuery(fields, 'exercise_template');
export const deleteExerciseTemplate = () => 'DELETE FROM exercise_template WHERE id = $1 RETURNING *';
export const getExerciseTemplateById = () => 'SELECT * FROM exercise_template WHERE id = $1';

export const getUserExerciseTemplates = (order: OrderType, sportId?: number) => {
    return `
        SELECT * FROM exercise_template
        WHERE user_id = $1 ${sportId ? 'AND sport_id = $4' : ''}
        ORDER BY created_date ${order}
        LIMIT $2 OFFSET $3
    `;
};
