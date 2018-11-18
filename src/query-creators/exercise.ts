import {OrderType} from './base';

export const createExerciseTemplate = () => {
    return `INSERT INTO exercise_template (
        title, description, user_id, sport_id
    ) VALUES ($1, $2, $3, $4) RETURNING *`;
};

export const updateExerciseTemplate = (fields: string[]) => {
    return `UPDATE exercise_template SET (
        ${fields.join(', ')}
    ) = (${fields.map((field, i) => `$${i+=2}`).join(', ')}) WHERE id = $1 RETURNING *`;
};

export const deleteExerciseTemplate = () => {
    return `DELETE FROM exercise_template WHERE id = $1 RETURNING *`;
};

export const getExerciseTemplateById = () => {
    return `SELECT * FROM exercise_template WHERE id = $1`;
};

export const getUserExerciseTemplates = (order: OrderType = 'ASC') => {
    return `
        SELECT * FROM exercise_template WHERE user_id = $1 AND sport_id = $2
        ORDER BY created_date ${order} LIMIT $3 OFFSET $4
    `;
};

export const createExercise = () => {
    return `INSERT INTO exercise (
        exercise_template_id, duration, reps
    ) VALUES ($1, $2, $3)`;
};

export const updateExercise = (fields: string[]) => {
    return `UPDATE exercise SET (
        ${fields.join(', ')}
    ) = (${fields.map((field, i) => `$${i+=2}`).join(', ')}) WHERE id = $1 RETURNING *`;
};

export const getExercisesByIds = (idsCount: number) => {
    const ids = [];
    for (let i = 1; i < idsCount + 1; i++) {
        ids.push(`id = ${i}`);
    }
    return `SELECT * FROM exercise WHERE ${ids.join(' OR ')}`;
};

export const getUserExercises = (order: OrderType = 'ASC') => {
    return `
        SELECT * FROM exercise
        INNER JOIN exercise_template ON exercise.exercise_template_id = exercise_template.id
        WHERE exercise_template.user_id = $1 AND sport_id = $2
        ORDER BY exercise.created_date ${order} LIMIT $3 OFFSET $4
    `;
};

export const deleteExercise = () => {
    return `DELETE FROM exercise WHERE id = $1 RETURNING *`;
};

