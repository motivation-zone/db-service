export const createUser = () => {
    return `INSERT INTO users (
        login, name, password, email, country, self_info, weight, growth, birth_date
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`;
};

export const updateUser = (fieldNames: string[]) => {
    return `UPDATE users SET (
        ${fieldNames.join(', ')}
        ) = (${fieldNames.map((i) => `$${i}`).join(', ')}) WHERE id = $1`;
};

export const getUserById = () => {
    return `SELECT * FROM users WHERE id = $1`;
};

export const getUserByLogin = (isStrict: boolean = true) => {
    if (isStrict) {
        return `SELECT * FROM users WHERE login = $1`;
    } else {
        return `SELECT * FROM users WHERE login LIKE $1`;
    }
};

export const getUser = (isDesc: boolean = false) => {
    return `SELECT * FROM users LIMIT $1 OFFSET $2 ORDER BY registered ${isDesc ? ' DESC' : ''}`;
};

export const deleteUser = () => {
    return `DELETE FROM users WHERE id = $1`;
};
