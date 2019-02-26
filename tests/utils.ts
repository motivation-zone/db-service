export const checkAssertion = (a: any, b: any, strict = false): boolean => {
    if (a instanceof Date && b instanceof Date) {
        a = String(a);
        b = String(a);
    }

    return strict ? a === b : a == b; // tslint:disable-line
};
