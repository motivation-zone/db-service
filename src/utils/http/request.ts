import got from 'got';

interface IResponse {
    body: any;
    status?: number;
    error?: boolean;
}

export default async (url: string, options = {}): Promise<IResponse> => {
    try {
        const {body, statusCode} = await got(url, options);
        return {body, status: statusCode};
    } catch (err) {
        return {error: true, status: err.statusCode, body: err.response.body};
    }
}