import {OrderType} from './base';

const returningFields = [
    'id', 'name', 'email', 'country',
    'is_athlete', 'self_info', 'weight', 'growth',
    'birth_date', 'is_banned', 'registered'
].join(', ');

export const createUser = () => {
    return `INSERT INTO users (
        login, name, password, email, country, self_info, weight, growth, birth_date
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING ${returningFields}`;
};

export const updateUser = (fields: string[]) => {
    return `UPDATE users SET (
        ${fields.join(', ')}
        ) = (${fields.map((field, i) => `$${i+=2}`).join(', ')}) WHERE id = $1 RETURNING ${returningFields}`;
};

export const getUserById = () => {
    return `SELECT * FROM users WHERE id = $1`;
};

export const getUserByLogin = (strict: boolean = true) => {
    if (strict) {
        return `SELECT * FROM users WHERE login = $1`;
    } else {
        return `SELECT * FROM users WHERE login LIKE '%' || $1 || '%' LIMIT 10`;
    }
};

export const getUsers = (order: OrderType = 'ASC') => {
    return `SELECT * FROM users ORDER BY registered ${order} LIMIT $1 OFFSET $2`
};

export const deleteUser = () => {
    return `DELETE FROM users WHERE id = $1 RETURNING ${returningFields}`;
};
