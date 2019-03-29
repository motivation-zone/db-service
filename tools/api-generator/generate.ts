import fs from 'fs';
import json2yaml from 'json2yaml';

import {getAbsolutePath} from 'src/utils/fs';
import jsdocParser, {IController, IModel} from 'tools/api-generator/jsdoc-parser';

const APP_VERSION = JSON.parse(fs.readFileSync(getAbsolutePath('./package.json'), 'utf-8')).version;
const filePath = getAbsolutePath(`./docs/swagger`);

const build = (controllers: IController[], models: IModel[]): any => {
    const paths = controllers.reduce((result, controller) => {
        result[controller.url] = {
            [controller.method]: {
                tags: [controller.tag],
                parameters: controller.parameters.map((param) => {
                    const updateParam: any = {};
                    if (param.schema.ref) {
                        updateParam.schema = {$ref: `#/components/schemas/${param.schema.ref}`};
                    }

                    return Object.assign({}, param, updateParam);
                }),
                operationId: controller.operationId,
                responses: {
                    200: {
                        description: '',
                        content: {
                            'application/json': {
                                schema: {
                                    // type is array -> items: {'ref'}
                                    type: controller.response.type,
                                    items: {
                                        $ref: `#/components/schemas/${controller.response.schema}`
                                    }
                                }
                            }
                        }
                    }
                }
            }
        };

        return result;
    }, {} as any);

    const schemas = models.reduce((result, model) => {
        result[model.name] = {
            type: model.type,
            required: model.required,
            properties: model.properties.reduce((result, props) => {
                result[props.name] = {
                    type: props.type,
                    example: props.example,
                    format: props.format
                };
                return result;
            }, {} as any)
        };

        return result;
    }, {} as any);

    const result = {
        openapi: '3.0.0',
        servers: [],
        info: {
            description: 'API',
            version: APP_VERSION,
            title: 'db-service',
            contact: {email: 'dondiego4697@mail.ru'},
            license: {
                name: 'Apache 2.0',
                url: 'http://www.apache.org/licenses/LICENSE-2.0.html'
            }
        },
        paths,
        components: {schemas},
        tags: Array.from(
            new Set(controllers.map((controller) => controller.tag))
        ).map((tag) => ({name: tag}))
    };

    return result;
};

(async () => {
    const jsonPath = `${filePath}.json`;
    const ymlPath = `${filePath}.yml`;
    try {
        fs.unlinkSync(jsonPath);
        fs.unlinkSync(ymlPath);
    } catch (e) {}

    const {controllers, models} = await jsdocParser();
    const result = build(controllers, models);
    fs.appendFileSync(jsonPath, JSON.stringify(result));

    const yaml = json2yaml.stringify(result);
    fs.appendFileSync(ymlPath, yaml);
})();
