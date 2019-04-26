import {IResponse, formResponse} from 'src/utils/http/response';
import request from 'src/utils/http/request';

interface IParams<T> {
    url: string;
    ModelClass: {new(data: any): T};
    data?: any;
}

const REQUEST_HEADERS = {
    Accept: 'application/json',
    Authorization: process.env.MZ_DB_SERVICE_TOKEN
};
const BASE_URL = 'http://localhost:8080';

export const getRequest = async <T>(params: IParams<T>): Promise<IResponse<T[]>> => {
    const {url: path, ModelClass} = params;

    const url = `${BASE_URL}${path}`;
    const result = await request(url, {
        headers: REQUEST_HEADERS,
        json: true
    });

    return formResponse<T>(result, ModelClass);
};

export const postRequest = async <T>(params: IParams<T>): Promise<IResponse<T[]>> => {
    const {url: path, ModelClass, data} = params;

    const url = `${BASE_URL}${path}`;
    const result = await request(url, {
        headers: REQUEST_HEADERS,
        json: true,
        body: data,
        method: 'POST'
    });

    return formResponse<T>(result, ModelClass);
};

export const deleteRequest = async <T>(params: IParams<T>): Promise<IResponse<T[]>> => {
    const {url: path, ModelClass} = params;

    const url = `${BASE_URL}${path}`;
    const result = await request(url, {
        headers: REQUEST_HEADERS,
        json: true,
        method: 'DELETE'
    });

    return formResponse<T>(result, ModelClass);
};
