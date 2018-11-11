export const getSports = () => {
    return `SELECT * FROM sport`;
};

export const addUser = () => {
    return `INSERT INTO user_sport_link (user_id, sport_id) VALUES ($1, $2)`;
};
