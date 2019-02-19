import {OrderType} from './base';
import {USER_RETURNING_FIELDS} from './user';

export const getSports = () => 'SELECT * FROM sport';

export const addUser = () => {
    return 'INSERT INTO user_sport (user_id, sport_id) VALUES ($1, $2) RETURNING *';
};

export const deleteUser = () => {
    return 'DELETE FROM user_sport WHERE (user_id, sport_id) = ($1, $2) RETURNING *';
};

export const getUsers = (order: OrderType = OrderType.ASC) => {
    const userFields = USER_RETURNING_FIELDS.split(', ').map((f) => {
        return ['id', 'name'].indexOf(f) !== -1 ? `users.${f}` : f;
    }).join(', ');

    return `
        SELECT ${userFields} FROM users
        INNER JOIN user_sport ON users.id = user_sport.user_id
        INNER JOIN sport ON user_sport.sport_id = sport.id
        WHERE sport.id = $3
        ORDER BY registered_date ${order} LIMIT $1 OFFSET $2
    `;
};
