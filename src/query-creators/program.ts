import {OrderType, updateQuery} from 'src/query-creators/base';

export const createProgram = () => {
    return `
        INSERT INTO program (
            user_id, sport_id, price, difficulty_level
        ) VALUES (
            $1, $2, $3, $4
        ) RETURNING *
    `;
};

export const updateProgram = (fields: string[]) => updateQuery(fields, 'program');
export const deleteProgram = () => 'DELETE FROM program WHERE id = $1 RETURNING *';
export const getProgramById = () => 'SELECT * FROM program WHERE id = $1';

export const getPrograms = (order: OrderType = OrderType.ASC, fields: string[]) => {
    return `
        SELECT * FROM program
        WHERE ${fields.map((field, i) => `${field} = ${i + 3}`).join(' AND ')}
        ORDER BY created_date ${order} LIMIT $1 OFFSET $2
    `;
};

export const buyProgram = () => {
    return `
        INSERT INTO bought_program (
            user_id, program_id, transaction
        ) VALUES (
            $1, $2, $3
        ) RETURNING *
    `;
};

export const getUserBoughtPrograms = (order: OrderType = OrderType.ASC) => {
    return `
        SELECT * FROM program
        INNER JOIN bought_program ON bought_program.program_id = program.id
        WHERE bought_program.user_id = $1
        ORDER BY bought_date ${order} LIMIT $2 OFFSET $3
    `;
};

// TODO create ignores in db if price != 0
export const saveProgram = () => {
    return `
        INSERT INTO user_program_saved (
            user_id, program_id
        ) VALUES (
            $1, $2
        ) RETURNING *
    `;
};

export const unsafeProgram = () => {
    return 'DELETE FROM user_program_saved WHERE user_id = $1 AND program_id = $2 RETURNING *';
};

export const getUserSavedPrograms = (order: OrderType = OrderType.ASC) => {
    return `
        SELECT * FROM program
        INNER JOIN user_program_saved ON user_program_saved.program_id = program.id
        WHERE user_program_saved.user_id = $1
        ORDER BY save_date ${order} LIMIT $2 OFFSET $3
    `;
};
