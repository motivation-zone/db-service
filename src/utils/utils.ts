export const stringToBoolean = (value: string): boolean | undefined => {
    if (typeof value === 'undefined') {
        return;
    }

    return value === 'true' ? true : value === 'false' ? false : undefined;
};

export const checkNecessaryFields = (fields: any[], obj: any): boolean => {
    return fields.every((field) => {
        return Boolean(obj[field]);
    });
}
