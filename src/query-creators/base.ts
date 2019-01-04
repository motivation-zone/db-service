export type OrderType = 'DESC' | 'ASC';

export const updateQuery = (fields: string[], tableName: string, returning: string = '*') => {
    if (fields.length > 1) {
        return `UPDATE ${tableName} SET (
            ${fields.join(', ')}
        ) = (${fields.map((_, i) => `$${i+=2}`).join(', ')}) WHERE id = $1 RETURNING ${returning}`;
    }

    return `UPDATE ${tableName} SET ${fields[0]} = $2 WHERE id = $1 RETURNING ${returning}`;
};
