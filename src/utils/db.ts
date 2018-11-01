export const translateNodeToPostgresqlName = (field: string): string => {
    return field.split(/(?=[A-Z])/).map((x) => x.toLowerCase()).join('_');
};
