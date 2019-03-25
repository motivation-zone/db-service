import fs from 'fs';
import path from 'path';

import UserControllerInterface from 'src/controllers/user.interface';
import SportControllerInterface from 'src/controllers/sport.interface';
import CountryControllerInterface from 'src/controllers/country.interface';
import DifficultyLevelControllerInterface from 'src/controllers/difficulty-level.interface';

import UserModelInterface from 'src/models/user.interface';
import LinkUserSportModelInterface from 'src/models/link/user-sport.interface';
import DifficultyModelInterface from 'src/models/difficulty-level.interface';
import CountryModelInterface from 'src/models/country.interface';

import {IApiParam} from 'tools/api-doc';

const controllers = [
    UserControllerInterface,
    SportControllerInterface,
    CountryControllerInterface,
    DifficultyLevelControllerInterface
];

const models = [
    UserModelInterface,
    LinkUserSportModelInterface,
    DifficultyModelInterface,
    CountryModelInterface
];

const rootPath = path.resolve(__dirname, '..');
const filePath = path.resolve(rootPath, 'docs/API.md')

try {
    fs.unlinkSync(filePath);
} catch (e) {}

const header = ['| Method | Url | Body | Query | Return |', '|---|---|---|---|---|'].join('\n');

const wrapText = (value: string) => {
    if (value) {
        return `\`\`\`${value}\`\`\``;
    }

    return value;
};

const createParam = (params: IApiParam[]): string[] => {
    const result: string[] = [];
    params.forEach(({name, type, def}) => {
        result.push(wrapText(`${name} {${type}}${def ? `: ${def}` : ''}`));
    });
    return result;
};

const resultControllers = controllers.map((controller) => {
    const result = [`## ${controller.prefix}`, header];

    controller.methods.forEach(({method, url, body, query, params, returns}) => {
        const bodyData: string[] = [];
        const queryData: string[] = [];
        const paramsData: string[] = [];
        const returnData: string[] = []

        if (body) {
            if (typeof body === 'string') {
                bodyData.push(`[${body}](#${body})`);
            } else {
                bodyData.push(...createParam(body));
            }
        }

        if (query) {
            queryData.push(...createParam(query));
        }

        if (params) {
            paramsData.push(...createParam(params));
        }

        if (returns) {
            if (typeof returns === 'string') {
                let isArray = '';
                if (returns.includes('[]')) {
                    returns = returns.replace('[]', '');
                    isArray = '[]';
                }
                returnData.push(`[${returns}${isArray}](#${returns})`);
            } else {
                returnData.push(...createParam(returns));
            }
        }

        result.push(`| ${method} | **${url}** | ${bodyData.join(', ')} | ${queryData.join(', ')} | ${returnData.join(', ')} |`);
    });
    return result.join('\n');
});

const resultModels = models.map((model) => {
    const result = [`## ${model.name}`];
    result.push(wrapText(`json\n${JSON.stringify(model.object)}\n`));

    return result.join('\n');
});

fs.appendFileSync(filePath, [...resultControllers, ...resultModels].join('\n\n'));
