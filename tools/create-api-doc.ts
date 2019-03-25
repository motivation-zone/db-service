import fs from 'fs';
import path from 'path';

import UserControllerInterface from 'src/controllers/user.interface';
import SportControllerInterface from 'src/controllers/sport.interface';

import UserModelInterface from 'src/models/user.interface';
import LinkUserSportModelInterface from 'src/models/link/user-sport.interface';

const controllers = [
    UserControllerInterface,
    SportControllerInterface
];

const models = [
    UserModelInterface,
    LinkUserSportModelInterface
];

const rootPath = path.resolve(__dirname, '..');
const filePath = path.resolve(rootPath, 'docs/API.md')

try {
    fs.unlinkSync(filePath);
} catch (e) {}

const header = ['| Method | Url | Body | Query |', '|---|---|---|---|'].join('\n');

const wrapText = (value: string) => {
    if (value) {
        return `\`\`\`${value}\`\`\``;
    }

    return value;
};

const resultControllers = controllers.map((controller) => {
    const result = [`## ${controller.prefix}`, header];

    controller.methods.forEach(({method, url, body, query}) => {
        let bodyData: string[] = [];
        let queryData: string[] = [];

        if (body) {
            if (typeof body === 'string') {
                bodyData.push(`[${body}](#${body})`);
            } else {
                body.forEach(({name, type, def}) => {
                    bodyData.push(wrapText(`${name} {${type}}${def ? `: ${def}` : ''}`));
                });
            }
        }

        if (query) {
            query.forEach(({name, type, def}) => {
                queryData.push(wrapText(`${name} {${type}}${def ? `: ${def}` : ''}`));
            });
        }

        result.push(`| ${method} | **${url}** | ${bodyData.join(', ')} | ${queryData.join(', ')} |`);
    });
    return result.join('\n');
});

const resultModels = models.map((model) => {
    const result = [`## ${model.name}`];
    result.push(wrapText(`json\n${JSON.stringify(model.object)}`));

    return result.join('\n');
});

fs.appendFileSync(filePath, [...resultControllers, ...resultModels].join('\n\n'));
