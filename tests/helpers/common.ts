import request from 'supertest';

import app from 'src/app';
import {IResponse, formResponse} from 'src/utils/http/response';

interface IParams<T> {
    url: string;
    ModelClass: {new(data: any): T};
    data?: any;
}

const agent = request.agent(app);
const REQUEST_HEADERS = {Accept: 'application/json'};

export const getRequest = async <T>(params: IParams<T>): Promise<IResponse<T[]>> => {
    const {url, ModelClass} = params;

    return await new Promise((resolve, reject) => {
        agent
            .get(url)
            .set(REQUEST_HEADERS)
            .end((error, response) => {
                if (error) {
                    return reject(error);
                }

                const result = formResponse<T>(response, ModelClass);
                resolve(result);
            });
    });
};

export const postRequest = async <T>(params: IParams<T>): Promise<IResponse<T[]>> => {
    const {url, ModelClass, data} = params;

    return await new Promise((resolve, reject) => {
        agent
            .post(url)
            .send(data)
            .set(REQUEST_HEADERS)
            .end((error, response) => {
                if (error) {
                    return reject(error);
                }

                const result = formResponse<T>(response, ModelClass);
                resolve(result);
            });
    });
};

export const deleteRequest = async <T>(params: IParams<T>): Promise<IResponse<T[]>> => {
    const {url, ModelClass} = params;

    return await new Promise((resolve, reject) => {
        agent
            .delete(url)
            .set(REQUEST_HEADERS)
            .end((error, response) => {
                if (error) {
                    return reject(error);
                }

                const result = formResponse<T>(response, ModelClass);
                resolve(result);
            });
    });
};
