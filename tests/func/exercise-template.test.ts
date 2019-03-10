import {expect, assert} from 'chai';
import pMap from 'p-map';

import {
    dbActions as exerciseTemplateDbActions,
    generateExerciseTemplate
} from 'tests/helpers/exercise-template';
import {dbActions as sportDbActions} from 'tests/helpers/sport';
import {dbActions as userDbActions} from 'tests/helpers/user';
import {REQUIRED_FIELDS, NOT_UPDATED_FIELDS, IExerciseTemplateModel} from 'src/models/exercise-template';
import {checkOrder, checkAssertion} from 'tests/utils';
import {removeNotUpdatedFields} from 'src/utils';

const {
    insertExerciseTemplate, getExerciseTemplates,
    getExerciseTemplate, updateExerciseTemplate,
    deleteExerciseTemplate
} = exerciseTemplateDbActions;
const {getAllSports} = sportDbActions;
const {getUsers} = userDbActions;

describe('Exercise-template:', () => {
    describe('Create template', () => {
        it('simple', async () => {
            const {data: [sport]} = await getAllSports();
            const {data: [user]} = await getUsers({limit: 20, skip: 0});

            const template = generateExerciseTemplate(user.id!, sport.id!);
            const {data: [insertedTemplate], status} = await insertExerciseTemplate(template);
            expect(status).to.equal(200);

            expect(insertedTemplate.id).to.be.ok;
            expect(insertedTemplate.createdDate).to.be.ok;
            template.id = insertedTemplate.id;
            template.createdDate = insertedTemplate.createdDate;
            expect(insertedTemplate).to.deep.equal(template);

            const {error: {message}, status: statusExistedTemplate} = await insertExerciseTemplate(template);
            expect(statusExistedTemplate).to.equal(409);
            expect(message.includes('already exist')).to.be.true;
        });

        it('with nonexistent sportId', async () => {
            const {data: [user]} = await getUsers({limit: 20, skip: 0});

            const template = generateExerciseTemplate(user.id!, 9999999999);
            const {error: {message}, status} = await insertExerciseTemplate(template);
            expect(status).to.equal(409);
            expect(message.includes('is not present in table "sport"')).to.be.true;
        });

        it('with nonexistent userId', async () => {
            const {data: [sport]} = await getAllSports();

            const template = generateExerciseTemplate(9999999999, sport.id!);
            const {error: {message}, status} = await insertExerciseTemplate(template);
            expect(status).to.equal(409);
            expect(message.includes('is not present in table "users"')).to.be.true;
        });

        it('without required fields', async () => {
            const {data: [sport]} = await getAllSports();
            const {data: [user]} = await getUsers({limit: 20, skip: 0});

            await Promise.all(REQUIRED_FIELDS.map(async (field) => {
                const template = generateExerciseTemplate(user.id!, sport.id!);
                delete template[field];

                const {error: {message}, status} = await insertExerciseTemplate(template);

                expect(message).to.equal(`"${field}" is required`);
                expect(status).to.equal(400);
            }));
        });
    });

    describe('Get user templates', () => {
        it('without limit params', async () => {
            const {data: [user]} = await getUsers({limit: 20, skip: 0});
            const {status} = await getExerciseTemplates({userId: user.id!}, {});
            expect(status).to.equal(400);
        });

        it('all with order param = ASC', async () => {
            const {data: [user]} = await getUsers({limit: 20, skip: 0});
            const {data: templates} = await getExerciseTemplates(
                {userId: user.id!},
                {limit: 100, skip: 0}
            );
            expect(templates.length > 0).to.be.true;

            templates.forEach((template) => expect(template.userId).to.equal(user.id!));

            const checkAsc = checkOrder(templates, 'ASC', (template) => template.createdDate);
            expect(checkAsc).to.be.true;
        });

        it('all with order param = DESC', async () => {
            const {data: [user]} = await getUsers({limit: 20, skip: 0});
            const {data: templates} = await getExerciseTemplates(
                {userId: user.id!},
                {limit: 100, skip: 0, order: 'DESC'}
            );
            expect(templates.length > 0).to.be.true;

            templates.forEach((template) => expect(template.userId).to.equal(user.id!));

            const checkDesc = checkOrder(templates, 'DESC', (template) => template.createdDate);
            expect(checkDesc).to.be.true;
        });

        it('all by sport with order param = ASC', async () => {
            const {data: [user]} = await getUsers({limit: 20, skip: 0});
            const {data: templates} = await getExerciseTemplates(
                {userId: user.id!},
                {limit: 100, skip: 0}
            );

            const sportId = templates[0].sportId;
            const {data: templatesBySport} = await getExerciseTemplates(
                {userId: user.id!, sportId},
                {limit: 100, skip: 0}
            );

            expect(templatesBySport.length > 0).to.be.true;
            const check = templatesBySport.every((template) => {
                expect(template.userId).to.equal(user.id!);
                return template.sportId === sportId;
            });
            expect(check).to.be.true;

            const checkAsc = checkOrder(templates, 'ASC', (template) => template.createdDate);
            expect(checkAsc).to.be.true;
        });

        it('all by sport with order param = DESC', async () => {
            const {data: [user]} = await getUsers({limit: 20, skip: 0});
            const {data: templates} = await getExerciseTemplates(
                {userId: user.id!},
                {limit: 100, skip: 0, order: 'DESC'}
            );

            const sportId = templates[0].sportId;
            const {data: templatesBySport} = await getExerciseTemplates(
                {userId: user.id!, sportId},
                {limit: 100, skip: 0}
            );

            expect(templatesBySport.length > 0).to.be.true;
            const check = templatesBySport.every((template) => {
                expect(template.userId).to.equal(user.id!);
                return template.sportId === sportId;
            });
            expect(check).to.be.true;

            const checkDesc = checkOrder(templates, 'DESC', (template) => template.createdDate);
            expect(checkDesc).to.be.true;
        });
    });

    describe('Get template', () => {
        it('by id', async () => {
            const {data: [user]} = await getUsers({limit: 20, skip: 0});
            const {data: [template]} = await getExerciseTemplates(
                {userId: user.id!},
                {limit: 100, skip: 0, order: 'DESC'}
            );

            const {data: [gotTemplate]} = await getExerciseTemplate(template.id!);
            expect(template).to.deep.equal(gotTemplate);
        });
    });

    describe('Update template', () => {
        it('simple', async () => {
            const {data: [user]} = await getUsers({limit: 20, skip: 0});
            const {data: [template]} = await getExerciseTemplates(
                {userId: user.id!},
                {limit: 100, skip: 0}
            );
            const newTemplate = generateExerciseTemplate(template.userId!, template.sportId!);

            const updatedFields = removeNotUpdatedFields(
                Object.keys(template),
                NOT_UPDATED_FIELDS
            ) as (keyof IExerciseTemplateModel)[];

            await Promise.all(updatedFields.map(async (field) => {
                await updateExerciseTemplate(template.id!, {[field]: newTemplate[field]});
                const {data: [checkTemplate]} = await getExerciseTemplate(template.id!);

                assert(
                    checkAssertion(checkTemplate[field], newTemplate[field]),
                    `${field}: ${checkTemplate[field]} != ${newTemplate[field]}`
                );
            }));
        });

        it('with not updated fields and some updated field', async () => {
            await pMap(NOT_UPDATED_FIELDS, async (field) => {
                const {data: [user]} = await getUsers({limit: 20, skip: 0});
                const {data: [template]} = await getExerciseTemplates(
                    {userId: user.id!},
                    {limit: 100, skip: 0}
                );
                const newTemplate = generateExerciseTemplate(template.userId!, template.sportId!);

                await updateExerciseTemplate(template.id!, {
                    [field]: newTemplate[field],
                    // if send only not_updated_field => server remove it
                    // and send empty query => will be error 409 (next test)
                    description: newTemplate.description
                });
                const {data: [checkTemplate]} = await getExerciseTemplate(template.id!);

                assert(
                    checkAssertion(checkTemplate[field], template[field]),
                    `${checkTemplate[field]} != ${template[field]}`
                );
                expect(checkTemplate.description).to.equal(newTemplate.description);
            }, {concurrency: 1});
        });

        it('with only not updated fields', async () => {
            await Promise.all(NOT_UPDATED_FIELDS.map(async (field) => {
                const {data: [user]} = await getUsers({limit: 20, skip: 0});
                const {data: [template]} = await getExerciseTemplates(
                    {userId: user.id!},
                    {limit: 100, skip: 0}
                );
                const newTemplate = generateExerciseTemplate(template.userId!, template.sportId!);

                const {status} = await updateExerciseTemplate(template.id!, {[field]: newTemplate[field]});
                expect(status).to.equal(409);
            }));
        });

        it('with not existing id', async () => {
            const {data, status} = await updateExerciseTemplate(99999999, {title: 'title'});
            expect(data).to.be.empty;
            expect(status).to.equal(200);
        });
    });

    describe('Delete template', () => {
        it('simple', async () => {
            const {data: [user]} = await getUsers({limit: 20, skip: 0});
            const {data: [template]} = await getExerciseTemplates(
                {userId: user.id!},
                {limit: 100, skip: 0}
            );

            const {data: deletedTemplates} = await deleteExerciseTemplate(template.id!);
            expect(deletedTemplates.length === 1).to.be.true;

            const {data: [deletedTemplate]} = await getExerciseTemplate(template.id!);
            expect(deletedTemplate).to.be.not.ok;
        });
    });
});
