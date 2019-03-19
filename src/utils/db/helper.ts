export const translateNodeToPostgresqlName = (field: string): string => {
    return field.split(/(?=[A-Z])/).map((x) => x.toLowerCase()).join('_');
};

export const translatePostgresqlNameToNode = (field: string): string => {
    return field.split('_').map((part, i) => {
        if (i === 0) {
            return part;
        }
        return `${part.charAt(0).toUpperCase()}${part.slice(1)}`;
    }).join('');
};

export const createDbWhereText = (keys: string[], startIndex: number): string | null => {
    if (keys.length === 0) {
        return null;
    }

    return keys.map((key, i) => {
        return `${key}=$${i + startIndex}`;
    }).join(' AND ');
};
