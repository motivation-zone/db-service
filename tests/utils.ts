interface IExpectFields {
    json: [string, RegExp];
}
export const EXPECT_FIELDS: IExpectFields = {
    json: ['Content-Type', /json/]
};

export const REQUEST_HEADERS = {
    standart: {'Accept': 'application/json'}
};

export const generateString = (size: number) => {
    let text = '';
    const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (let i = 0; i < size; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
};

export const checkAssertion = (a: any, b: any, strict = false): boolean => {
    if (a instanceof Date && b instanceof Date) {
        a = String(a);
        b = String(a);
    }

    return strict ? a === b : a == b;
};