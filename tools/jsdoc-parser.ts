import glob from 'glob';
import fs from 'fs';
import path from 'path';
import commentParser from 'comment-parser';

import {apiUrls as URLS} from 'src/urls';

export interface IApiParam {
    name: string;
    type: string;
    default?: string;
}

interface Controller {
    urlPrefix: string;
    url: string;
    method: string;
    returns?: string | IApiParam[];
    body?: string | IApiParam[];
    query?: string | IApiParam[];
    urlParams?: string | IApiParam[];
}

interface Model {
    name: string;
    obj: any;
}

export interface ControllerData {
    [key: string]: Controller[];
}

const parseParams = (params: string): string | IApiParam[] => {
    try {
        return JSON.parse(params) as IApiParam[];
    } catch (e) {
        return params;
    }
};

export default async () => {
    const files: string[] = await new Promise((resolve, reject) => {
        const srcPath = path.resolve(__dirname, '../src');
        glob(`${srcPath}/**/*.ts`, {}, (err, files) => {
            if (err) {
                return reject(err);
            }

            resolve(files);
        });
    });

    // Filtered only api docs
    const apiDocsRow = files.map((file) => {
        const code = fs.readFileSync(file, 'utf-8');
        const result = commentParser(code);

        const apiComments = result.filter((comment) => {
            return comment.tags.find(({tag}) => tag === 'apiDoc');
        });

        if (apiComments.length === 0) {
            return;
        }

        return apiComments;
    }).filter(Boolean);

    const data = apiDocsRow.reduce((result, doc) => {
        const controllersRow = doc!.filter((comment) => {
            return comment.tags.find(({tag, name}) => tag === 'type' && name === 'controller');
        });
        const modelsRow = doc!.filter((comment) => {
            return comment.tags.find(({tag, name}) => tag === 'type' && name === 'model');
        });

        const controllers = controllersRow.map((doc) => {
            return doc.tags.reduce((res, {tag, name}) => {
                if (tag === 'url') {
                    const [provider, urlKey] = name.split('.');
                    res.urlPrefix = (URLS as any)[provider].prefix;
                    res.url = (URLS as any)[provider][urlKey];
                }
                if (tag === 'method') {
                    res.method = name;
                }
                if (tag === 'returns') {
                    res.returns = parseParams(name);
                }
                if (tag === 'urlParams') {
                    res.urlParams = parseParams(name);
                }
                if (tag === 'query') {
                    res.query = parseParams(name);
                }
                if (tag === 'body') {
                    res.body = parseParams(name);
                }
                return res;
            }, {} as Controller);
        });

        const models = modelsRow.map((doc) => {
            return doc.tags.reduce((res, {tag, name}) => {
                if (tag === 'name') {
                    res.name = name;
                }
                if (tag === 'object') {
                    name = name.replace(/(\n)|(\\)/gi, '');
                    const fields = JSON.parse(name) as IApiParam[];
                    res.obj = fields.reduce((acc, f) => {
                        acc[f.name] = `${f.type}${f.default && `, default: ${f.default}` || ''}`;
                        return acc;
                    }, {} as any);
                }
                return res;
            }, {} as Model);
        });

        result.controllers.push(...controllers);
        result.models.push(...models);

        return result;
    }, {
        controllers: [] as Controller[],
        models: [] as Model[]
    });

    return data;
};
