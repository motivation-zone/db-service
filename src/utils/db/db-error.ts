export default class DBError extends Error {
    detail: string;
    error: string;

    constructor(detail: string, error: string) {
        super();
        this.detail = detail;
        this.error = error;
    }

    get message() {
        return `${this.detail}, ${this.error}`;
    }
}
