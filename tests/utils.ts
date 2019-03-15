export interface IGetLimitTest {
    limit?: number;
    skip?: number;
    order?: string;
}

export const checkAssertion = (a: any, b: any, strict = false): boolean => {
    if (a instanceof Date && b instanceof Date) {
        a = String(a);
        b = String(a);
    }

    return strict ? a === b : a == b; // tslint:disable-line
};

/**
 * Checker for correct sorting from DB
 */
export const checkOrder = <T>(array: T[], order: 'ASC' | 'DESC', getValue: (obj: T) => any): boolean => {
    return array.every((obj, i) => {
        if (i === 0) {
            return true;
        }

        if (order === 'DESC') {
            return getValue(obj) <= getValue(array[i - 1]);
        }

        return getValue(obj) >= getValue(array[i - 1]);
    });
};
