export const getCountries = () => {
    return `SELECT * FROM country`;
};

export const addUser = () => {
    return `INSERT INTO user_country_link (user_id, country_id) VALUES ($1, $2)`;
};
