import {OrderType, updateQuery} from 'src/query-creators/base';

export const EXERCISE_RETURNING_FIELDS = [
    ...['id', 'value', 'type', 'created_date', 'exercise_template_id'].map((x) => `exercise.${x}`),
    ...[
        'title as temp_title',
        'description as temp_description',
        'user_id as temp_user_id',
        'sport_id as temp_sport_id'
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

export interface IGetUserExercisesQuery {
    sportId: string;
    templateId: string;
}

export const getUserExercises = (order: OrderType, fieldsKeys: (keyof IGetUserExercisesQuery)[]) => {
    const table: IGetUserExercisesQuery = {
        sportId: 'exercise_template.sport_id',
        templateId: 'exercise.exercise_template_id'
    };

    const fields = fieldsKeys.map((key) => table[key]).map((field, i) => `${field}=$${i + 4}`).join(' AND ');
    return `
        SELECT ${EXERCISE_RETURNING_FIELDS} FROM exercise
        INNER JOIN exercise_template ON exercise.exercise_template_id = exercise_template.id
        WHERE exercise_template.user_id = $1 ${fields && `AND ${fields}`}
        ORDER BY exercise.created_date ${order} LIMIT $2 OFFSET $3
    `;
};

export const deleteExercise = () => 'DELETE FROM exercise WHERE id = $1 RETURNING *';
