import {OrderType} from './base';
import {USER_RETURNING_FIELDS} from './user';

export const getCountries = () => {
    return `SELECT * FROM country`;
};

export const getUsers = (order: OrderType = 'ASC') => {
    return `SELECT ${USER_RETURNING_FIELDS} FROM users WHERE users.country_id = $3
        ORDER BY registered_date ${order} LIMIT $1 OFFSET $2`;
};

export const getUsersWithoutCountry = (order: OrderType = 'ASC') => {
    return `SELECT ${USER_RETURNING_FIELDS} FROM users WHERE users.country_id IS NULL
        ORDER BY registered_date ${order} LIMIT $1 OFFSET $2`;
};
