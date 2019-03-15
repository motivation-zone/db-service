import {OrderType} from 'src/query-creators/base';
import {USER_RETURNING_FIELDS} from 'src/query-creators/user';

const SPORT_RETURNING_FIELDS = ['id', 'name'];

export const getSports = () => 'SELECT * FROM sport';

export const addUser = () => {
    return 'INSERT INTO user_sport (user_id, sport_id) VALUES ($1, $2) RETURNING *';
};

export const deleteUser = () => {
    return 'DELETE FROM user_sport WHERE (user_id, sport_id) = ($1, $2) RETURNING *';
};

export const getUsers = (order: OrderType) => {
    return `
        SELECT ${USER_RETURNING_FIELDS.map((x) => `users.${x}`).join(', ')} FROM users
        INNER JOIN user_sport ON users.id = user_sport.user_id
        INNER JOIN sport ON user_sport.sport_id = sport.id
        WHERE sport.id = $3
        ORDER BY registered_date ${order} LIMIT $1 OFFSET $2
    `;
};

export const getUsersSport = () => {
    return `
        SELECT ${SPORT_RETURNING_FIELDS.map((x) => `sport.${x}`).join(', ')} FROM sport
        INNER JOIN user_sport ON user_sport.sport_id = sport.id
        INNER JOIN users ON user_sport.user_id = users.id
        WHERE users.id = $1
    `;
};
