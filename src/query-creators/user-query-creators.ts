export const createUser = () => {
    return `INSERT INTO users (
        login, name, password, email, country, self_info, weight, growth, birth_date
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;
};

export const updateUser = (fieldNames: string[]) => {
    return `UPDATE users SET (
        ${fieldNames.join(', ')}
        ) = (${fieldNames.map(() => '?').join(', ')}) WHERE id = ?`;
};

export const getUserById = () => {
    return `SELECT * FROM users WHERE id = ?`;
};

export const getUserByLogin = (isStrict: boolean = true) => {
    if (isStrict) {
        return `SELECT * FROM users WHERE login = ?`;
    } else {
        return `SELECT * FROM users WHERE login LIKE ?`;
    }
};

export const getUser = (isDesc: boolean = false) => {
    return `SELECT * FROM users LIMIT ? OFFSET ? ORDER BY registered ${isDesc ? ' DESC' : ''}`;
};

export const deleteUser = () => {
    return `DELETE FROM users WHERE id = ?`;
};
