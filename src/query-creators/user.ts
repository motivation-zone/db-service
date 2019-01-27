import {OrderType, updateQuery} from './base';

export const USER_RETURNING_FIELDS = [
    'id', 'login', 'name', 'email', 'is_athlete',
    'self_info', 'gender', 'weight', 'growth', 'country_id',
    'birth_date', 'is_banned', 'instagram',
    'phone', 'registered_date'
].join(', ');

export const createUser = () => {
    return `INSERT INTO users (
        login, name, password, email, self_info, gender,
        weight, growth, country_id, birth_date,
        instagram, phone
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) RETURNING ${USER_RETURNING_FIELDS}`;
};

export const updateUser = (fields: string[]) => updateQuery(
    fields, 'users', `${USER_RETURNING_FIELDS}, password`
);

export const getUserById = () => {
    return `SELECT ${USER_RETURNING_FIELDS} FROM users WHERE id = $1`;
};

export const checkUser = () => {
    return `SELECT id FROM users WHERE login = $1 AND password = $2`;
};

export const getUserByLogin = (strict: boolean = true) => {
    if (strict) {
        return `SELECT ${USER_RETURNING_FIELDS} FROM users WHERE login = $1`;
    } else {
        return `SELECT ${USER_RETURNING_FIELDS} FROM users WHERE login LIKE '%' || $1 || '%' LIMIT 10`;
    }
};

export const getUsers = (order: OrderType = 'ASC') => {
    return `SELECT ${USER_RETURNING_FIELDS} FROM users ORDER BY registered_date ${order} LIMIT $1 OFFSET $2`;
};

export const deleteUser = () => {
    return `DELETE FROM users WHERE id = $1 RETURNING ${USER_RETURNING_FIELDS}`;
};
