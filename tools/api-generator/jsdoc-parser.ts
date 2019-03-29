import glob from 'glob';
import fs from 'fs';
import commentParser from 'comment-parser';

import {getAbsolutePath} from 'src/utils/fs';
import {apiUrls, IApiUrls} from 'src/urls';

interface IModelProperty {
    name: string;
    type: string;
    example?: string;
}

export interface IModel {
    name: string;
    type: string;
    required: string[];
    properties: IModelProperty[];
}

interface IControllerParameter {
    in: string;
    name: string;
    required: boolean;
    description: string;
    schema: {
        type: string,
        ref: string
    };
}

interface IControllerResponse {
    schema: string;
    type: string;
}

export interface IController {
    url: string;
    method: string;
    operationId: string;
    parameters: IControllerParameter[];
    response: IControllerResponse;
    tag: string;
}

const parse = (row: string): any => {
    const d = row.replace(/(\n)|(\\)/gi, '');
    return JSON.parse(d);
};

export default async () => {
    const files: string[] = await new Promise((resolve, reject) => {
        const srcPath = getAbsolutePath('./src');
        glob(`${srcPath}/**/*.ts`, {}, (err, files) => {
            if (err) {
                return reject(err);
            }

            resolve(files);
        });
    });

    const apiDocs = files.map((file) => {
        const code = fs.readFileSync(file, 'utf-8');
        const result = commentParser(code);

        const apiComments = result.filter((comment) => {
            return comment.tags.find(({tag}) => tag === 'api');
        });

        return apiComments;
    }).reduce((acc, arr) => {
        arr.forEach((curr) => acc.push(curr));
        return acc;
    }, []);

    const controllersDoc = apiDocs.filter((doc) => {
        return doc.tags.find(({tag, name}) => tag === 'type' && name === 'controller');
    });

    const modelsDoc = apiDocs.filter((doc) => {
        return doc.tags.find(({tag, name}) => tag === 'type' && name === 'model');
    });

    const models = modelsDoc.map((doc) => {
        const name = doc.tags.find(({tag}) => tag === 'name')!.name;
        const objRow = doc.tags.find(({tag}) => tag === 'object')!.type;
        const obj = parse(objRow);
        obj.name = name;
        return obj as IModel;
    });

    const controllers = controllersDoc.map((doc) => {
        const urlKey = doc.tags.find(({tag}) => tag === 'url')!.name;
        const urlKeySplit = urlKey.split('.') as (keyof IApiUrls)[];
        const method = doc.tags.find(({tag}) => tag === 'method')!.name;
        const operationId = doc.tags.find(({tag}) => tag === 'operationId')!.name;

        const parametersRow = doc.tags.find(({tag}) => tag === 'parameters')!.type;
        const parameters = parse(parametersRow);

        const responseRow = doc.tags.find(({tag}) => tag === 'response')!.type;
        const response = parse(responseRow);

        const url = `${apiUrls[urlKeySplit[0]].prefix}${(apiUrls[urlKeySplit[0]] as any)[urlKeySplit[1]]}`;
        const urlParams = /.+(:.+)(\/|$)/gi.exec(url);

        const tag = doc.tags.find(({tag}) => tag === 'tag')!.name;

        return {
            url: urlParams ? url.replace(urlParams[1], `\${${urlParams[1].slice(1)}}`) : url,
            method,
            operationId,
            parameters,
            response,
            tag
        } as IController;
    });

    return {controllers, models};
};
