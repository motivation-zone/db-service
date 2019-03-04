import {OrderType, updateQuery} from 'src/query-creators/base';

export const createExercise = (fields: string[]) => {
    const f = ['exercise_template_id'].concat(fields);
    return `
        INSERT INTO exercise (
            ${f.join(', ')}
        ) VALUES (
            ${f.map((_, i) => `$${i + 1}`).join(', ')}
        ) RETURNING *
    `;
};

export const updateExercise = (fields: string[]) => updateQuery(fields, 'exercise');

export const getExerciseById = () => {
    return 'SELECT * FROM exercise WHERE id = $1';
};

export const getUserExercisesBySport = (order: OrderType = OrderType.ASC) => {
    return `
        SELECT * FROM exercise
        INNER JOIN exercise_template ON exercise.exercise_template_id = exercise_template.id
        WHERE exercise_template.user_id = $1 AND exercise_template.sport_id = $2
        ORDER BY exercise.created_date ${order} LIMIT $3 OFFSET $4
    `;
};

export const getAllUserExercises = (order: OrderType = OrderType.ASC) => {
    return `
        SELECT * FROM exercise
        INNER JOIN exercise_template ON exercise.exercise_template_id = exercise_template.id
        WHERE exercise_template.user_id = $1
        ORDER BY exercise.created_date ${order} LIMIT $2 OFFSET $3
    `;
};

export const deleteExercise = () => 'DELETE FROM exercise WHERE id = $1 RETURNING *';
