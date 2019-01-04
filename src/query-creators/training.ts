import {OrderType, updateQuery} from './base';

export const addTrainingToProgram = () => {
    return `INSERT INTO training_program_link (
        program_id, training_id, day
    ) VALUES ($1, $2, $3) RETURNING *`;
};

// training_id, day
export const updateTrainingInProgram = (fields: string[]) => updateQuery(fields, 'training_program_link');

export const deleteTrainingFromProgram = () => {
    return `DELETE FROM training_program_link WHERE id = $1 RETURNING *`;
};

export const createTraining = () => {
    return `INSERT INTO training (
        title, description, difficulty_level, is_daily, is_hidden, type_id,
        user_id, sport_id, duration
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`;
};

export const updateTraining = (fields: string[]) => updateQuery(fields, 'training');

export const deleteTraining = () => {
    return `DELETE FROM training WHERE id = $1 RETURNING *`;
};

export const getTrainingById = () => {
    return `SELECT * FROM training WHERE id = $1`;
};

export const getDailyTrainings = (order: OrderType = 'ASC') => {
    return `SELECT * FROM training WHERE is_daily = true ORDER BY created_date ${order} LIMIT $1 OFFSET $2`;
};

// user_id sport_id type_id difficulty_level is_daily is_hidden
export const getTrainings = (order: OrderType = 'ASC', fields: string[]) => {
    return `SELECT * FROM training
    WHERE ${fields.map((field, i) => `${field} = ${i += 3}`).join(' AND ')}
    ORDER BY created_date ${order} LIMIT $1 OFFSET $2`;
};

export const createTrainingRound = () => {
    return `INSERT INTO training_round (
        training_id, sets, position, exercises
    ) VALUES ($1, $2, $3, $4) RETURNING *`;
};

export const deleteTrainingRound = () => {
    return `DELETE FROM training_round WHERE id = $1 RETURNING *`;
};

// sets, positions, exercises
export const updateTrainingRound = (fields: string[]) => updateQuery(fields, 'training_round');

export const getTrainingRoundsByTraining = () => {
    return `SELECT * FROM training_round WHERE training_id = $1`;
};

// TODO create ignores in db if is_hidden = true
export const saveTraining = () => {
    return `INSERT INTO user_training_saved (
        user_id, training_id
    ) VALUES ($1, $2) RETURNING *`;
};

export const unsafeTraining = () => {
    return `DELETE FROM user_training_saved WHERE user_id = $1 AND training_id = $2 RETURNING *`;
};

export const getUserSavedTrainings = (order: OrderType = 'ASC') => {
    return `SELECT * FROM training
    INNER JOIN user_training_saved ON user_training_saved.training_id = training.id
    WHERE user_training_saved.user_id = $1
    ORDER BY save_date ${order} LIMIT $2 OFFSET $3`;
};
