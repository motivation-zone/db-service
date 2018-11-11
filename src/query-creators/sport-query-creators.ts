import {OrderType} from './base';

export const getSports = () => {
    return `SELECT * FROM sport`;
};

export const addUser = () => {
    return `INSERT INTO user_sport_link (user_id, sport_id) VALUES ($1, $2)`;
};

export const getUsers = (order: OrderType = 'ASC') => {
    return `SELECT * FROM users
        INNER JOIN user_sport_link ON users.id = user_sport_link.user_id
        INNER JOIN sport ON user_sport_link.sport_id = sport.id
        WHERE sport.id = $3
        ORDER BY registered ${order} LIMIT $1 OFFSET $2`;
};
