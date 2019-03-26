import fs from 'fs';
import path from 'path';
import jsdocParser, {ControllerData} from 'tools/jsdoc-parser';

const rootPath = path.resolve(__dirname, '..');
const filePath = path.resolve(rootPath, 'docs/API.md');

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

const isArrayCheck = (value: string): {isArray: boolean, value: string} => {
    const isArray = value.includes('[]');
    return {
        isArray,
        value: value.replace('[]', '')
    };
};

const makeLink = (key: string, isArray: boolean): string => {
    return `[${key}${isArray && '[]' || ''}](#${key})`;
};

const createParams = (params: any): string => {
    if (!params) {
        return 'null';
    }

    if (typeof params === 'string') {
        const {isArray, value} = isArrayCheck(params);
        return makeLink(value, isArray);
    }

    return wrapText(`${JSON.stringify(params)}`);
};

(async () => {
    const {controllers: controllersRow, models} = await jsdocParser();
    const controllersData = controllersRow.reduce((result, controller) => {
        const prefix = controller.urlPrefix;
        if (result[prefix]) {
            result[prefix].push(controller);
        } else {
            result[prefix] = [controller];
        }
        return result;
    }, {} as ControllerData);

    const resultControllers = Object.keys(controllersData).map((controllerKey) => {
        const controllers = controllersData[controllerKey];
        const result = [`## ${controllerKey}`, header];

        const body = controllers.map((c) => {
            const method = `**${c.method}**`;
            const url = `*${c.url}*`;
            const body = createParams(c.body);
            const query = createParams(c.query);
            const returns = createParams(c.returns);
            return `| ${[method, url, body, query, returns].join(' | ')} |`;
        });
        return result.concat(...body).join('\n');
    });

    const resultModels = models.map((m) => {
        const result = [`## ${m.name}`];
        return [result, createParams(m.obj)].join('\n');
    });

    fs.appendFileSync(filePath, [...resultControllers, ...resultModels].join('\n\n'));
})();
