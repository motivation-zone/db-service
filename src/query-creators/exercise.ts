import {OrderType, updateQuery} from 'src/query-creators/base';

export const EXERCISE_RETURNING_FIELDS = [
    ...['id', 'value', 'type', 'created_date', 'exercise_template_id'].map((x) => `exercise.${x}`),
    ...[
        'id as temp_id',
        'title as temp_title',
        'description as temp_description',
        'user_id as temp_user_id',
        'sport_id as temp_sport_id',
        'difficulty_level_id as temp_difficulty_level_id'
    ].map((x) => `exercise_template.${x}`)
].join(', ');

export const createExercise = (fields: string[]) => {
    const f = ['exercise_template_id'].concat(fields);
    return `
        INSERT INTO exercise (
            ${f.join(', ')}
        ) VALUES (
            ${f.map((_, i) => `$${i + 1}`).join(', ')}
        ) RETURNING exercise.*
    `;
};

export const updateExercise = (fields: string[]) => updateQuery(fields, 'exercise');

export const getExerciseById = () => {
    return `
        SELECT ${EXERCISE_RETURNING_FIELDS} FROM exercise
        INNER JOIN exercise_template ON exercise.exercise_template_id = exercise_template.id
        WHERE exercise.exercise_template_id = exercise_template.id AND exercise.id = $1
    `;
};

export const getUserExercises = (order: OrderType, whereText: string | null) => {
    return `
        SELECT ${EXERCISE_RETURNING_FIELDS} FROM exercise
        INNER JOIN exercise_template ON exercise.exercise_template_id = exercise_template.id
        WHERE exercise_template.user_id = $1 ${whereText && `AND ${whereText}` || ''}
        ORDER BY exercise.created_date ${order} LIMIT $2 OFFSET $3
    `;
};

export const deleteExercise = () => 'DELETE FROM exercise WHERE id = $1 RETURNING *';
