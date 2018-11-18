import {OrderType} from './base';

export const getCountries = () => {
    return `SELECT * FROM country`;
};

export const addUser = () => {
    return `INSERT INTO user_country_link (user_id, country_id) VALUES ($1, $2)`;
};

export const getUsers = (order: OrderType = 'ASC') => {
    return `SELECT * FROM users
        INNER JOIN user_country_link ON users.id = user_country_link.user_id
        INNER JOIN country ON user_country_link.country_id = country.id
        WHERE country.id = $3
        ORDER BY registered_date ${order} LIMIT $1 OFFSET $2`;
};
