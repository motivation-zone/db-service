import {expect, assert} from 'chai';
import pMap from 'p-map';

import {
    dbActions as exerciseTemplateDbActions,
    generateExerciseTemplate
} from 'tests/helpers/exercise-template';
import {dbActions as exerciseDbActions} from 'tests/helpers/exercise';
import {dbActions as sportDbActions} from 'tests/helpers/sport';
import {dbActions as userDbActions} from 'tests/helpers/user';
import {dbActions as difficultyLevelDbActions} from 'tests/helpers/difficulty-level';
import {REQUIRED_FIELDS, NOT_UPDATED_FIELDS, IExerciseTemplateModel} from 'src/models/exercise-template';
import {checkOrder, checkAssertion} from 'tests/utils';
import {removeNotUpdatedFields} from 'src/utils';

const {
    insertExerciseTemplate, getUserExerciseTemplates,
    getExerciseTemplate, updateExerciseTemplate,
    deleteExerciseTemplate
} = exerciseTemplateDbActions;
const {getUserExercises, deleteExercise} = exerciseDbActions;
const {getAllSports} = sportDbActions;
const {getUsers} = userDbActions;
const {getAllDifficultyLevels} = difficultyLevelDbActions;

const NONEXISTENT_ID = '9607957f-9f02-4e55-bd36-8961dba1f694';
const LIMIT_PARAMS = {limit: 100, skip: 0};

describe('Exercise-template:', () => {
    describe('Create template', () => {
        it('simple', async () => {
            const {data: [sport]} = await getAllSports();
            const {data: [user]} = await getUsers(LIMIT_PARAMS);
            const {data: [level]} = await getAllDifficultyLevels();

            const template = generateExerciseTemplate({
                userId: user.id!,
                sportId: sport.id!,
                difficultyLevelId: level.id!
            });
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

        it('with nonexistent sport id', async () => {
            const {data: [user]} = await getUsers(LIMIT_PARAMS);
            const {data: [level]} = await getAllDifficultyLevels();

            const template = generateExerciseTemplate({
                userId: user.id!,
                sportId: 99999999,
                difficultyLevelId: level.id!
            });

            const {error: {message}, status} = await insertExerciseTemplate(template);
            expect(status).to.equal(409);
            expect(message.includes('is not present in table "sport"')).to.be.true;
        });

        it('with nonexistent user id', async () => {
            const {data: [sport]} = await getAllSports();
            const {data: [level]} = await getAllDifficultyLevels();

            const template = generateExerciseTemplate({
                userId: NONEXISTENT_ID,
                sportId: sport.id!,
                difficultyLevelId: level.id!
            });
            const {error: {message}, status} = await insertExerciseTemplate(template);
            expect(status).to.equal(409);
            expect(message.includes('is not present in table "users"')).to.be.true;
        });

        it('with nonexistent difficulty-level id', async () => {
            const {data: [sport]} = await getAllSports();
            const {data: [user]} = await getUsers(LIMIT_PARAMS);

            const template = generateExerciseTemplate({
                userId: user.id!,
                sportId: sport.id!,
                difficultyLevelId: 99999999
            });
            const {error: {message}, status} = await insertExerciseTemplate(template);
            expect(status).to.equal(409);
            expect(message.includes('is not present in table "difficulty_level"')).to.be.true;
        });

        it('without required fields', async () => {
            const {data: [sport]} = await getAllSports();
            const {data: [user]} = await getUsers(LIMIT_PARAMS);
            const {data: [level]} = await getAllDifficultyLevels();

            await Promise.all(REQUIRED_FIELDS.map(async (field) => {
                const template = generateExerciseTemplate({
                    userId: user.id!,
                    sportId: sport.id!,
                    difficultyLevelId: level.id
                });
                delete template[field];

                const {error: {message}, status} = await insertExerciseTemplate(template);

                expect(message).to.equal(`"${field}" is required`);
                expect(status).to.equal(400);
            }));
        });
    });

    describe('Get user templates', () => {
        it('without limit params', async () => {
            const {data: [user]} = await getUsers(LIMIT_PARAMS);
            const {status} = await getUserExerciseTemplates({
                userId: user.id,
                limitParams: {}
            });
            expect(status).to.equal(400);
        });

        it('all with order param = ASC', async () => {
            const {data: [user]} = await getUsers(LIMIT_PARAMS);
            const {data: templates} = await getUserExerciseTemplates({
                userId: user.id,
                limitParams: LIMIT_PARAMS
            });
            expect(templates.length > 0).to.be.true;

            templates.forEach((template) => expect(template.userId).to.equal(user.id!));

            const checkAsc = checkOrder(templates, 'ASC', (template) => template.createdDate);
            expect(checkAsc).to.be.true;
        });

        it('all with order param = DESC', async () => {
            const {data: [user]} = await getUsers(LIMIT_PARAMS);
            const {data: templates} = await getUserExerciseTemplates({
                userId: user.id,
                limitParams: Object.assign({}, LIMIT_PARAMS, {order: 'DESC'})
            });
            expect(templates.length > 0).to.be.true;

            templates.forEach((template) => expect(template.userId).to.equal(user.id!));

            const checkDesc = checkOrder(templates, 'DESC', (template) => template.createdDate);
            expect(checkDesc).to.be.true;
        });

        it('all by sport', async () => {
            const {data: [user]} = await getUsers(LIMIT_PARAMS);
            const {data: templates} = await getUserExerciseTemplates({
                userId: user.id,
                limitParams: LIMIT_PARAMS
            });

            const sportId = templates[0].sportId;
            const {data: templatesBySport} = await getUserExerciseTemplates({
                userId: user.id,
                sportId,
                limitParams: LIMIT_PARAMS
            });

            expect(templatesBySport.length > 0).to.be.true;
            const check = templatesBySport.every((template) => {
                expect(template.userId).to.equal(user.id!);
                return template.sportId === sportId;
            });
            expect(check).to.be.true;
        });

        it('all by difficulty level', async () => {
            const {data: [user]} = await getUsers(LIMIT_PARAMS);
            const {data: templates} = await getUserExerciseTemplates({
                userId: user.id,
                limitParams: LIMIT_PARAMS
            });

            const difficultyLevelId = templates[0].difficultyLevelId;
            const {data: templatesByFilter} = await getUserExerciseTemplates({
                userId: user.id,
                difficultyLevelId,
                limitParams: Object.assign({}, LIMIT_PARAMS, {order: 'DESC'})
            });

            expect(templatesByFilter.length > 0).to.be.true;
            const check = templatesByFilter.every((template) => {
                expect(template.userId).to.equal(user.id!);
                return template.difficultyLevelId === difficultyLevelId;
            });
            expect(check).to.be.true;
        });

        it('all by difficulty level & sport', async () => {
            const {data: [user]} = await getUsers(LIMIT_PARAMS);
            const {data: [template]} = await getUserExerciseTemplates({
                userId: user.id,
                limitParams: LIMIT_PARAMS
            });

            const difficultyLevelId = template.difficultyLevelId;
            const sportId = template.sportId;
            const {data: templatesByFilter} = await getUserExerciseTemplates({
                userId: user.id,
                difficultyLevelId,
                sportId,
                limitParams: LIMIT_PARAMS
            });
            expect(templatesByFilter.length > 0).to.be.true;

            templatesByFilter.forEach((template) => {
                expect(template.difficultyLevelId).to.equal(difficultyLevelId);
                expect(template.sportId).to.equal(sportId);
            });
        });
    });

    describe('Get template', () => {
        it('by id', async () => {
            const {data: [user]} = await getUsers(LIMIT_PARAMS);
            const {data: [template]} = await getUserExerciseTemplates({
                userId: user.id,
                limitParams: Object.assign({}, LIMIT_PARAMS, {order: 'DESC'})
            });

            const {data: [gotTemplate]} = await getExerciseTemplate(template.id!);
            expect(template).to.deep.equal(gotTemplate);
        });
    });

    describe('Update template', () => {
        it('simple', async () => {
            const {data: [user]} = await getUsers(LIMIT_PARAMS);
            const {data: [template]} = await getUserExerciseTemplates({
                userId: user.id,
                limitParams: LIMIT_PARAMS
            });
            const {data: [level]} = await getAllDifficultyLevels();

            const newTemplate = generateExerciseTemplate({
                userId: template.userId!,
                sportId: template.sportId!,
                difficultyLevelId: level.id
            });

            const updatedFields = removeNotUpdatedFields(
                Object.keys(template),
                NOT_UPDATED_FIELDS
            ) as (keyof IExerciseTemplateModel)[];

            await pMap(updatedFields, async (field) => {
                await updateExerciseTemplate(template.id!, {[field]: newTemplate[field]});
                const {data: [checkTemplate]} = await getExerciseTemplate(template.id!);

                assert(
                    checkAssertion(checkTemplate[field], newTemplate[field]),
                    `${field}: ${checkTemplate[field]} != ${newTemplate[field]}`
                );
            }, {concurrency: 1});
        });

        it('with not updated fields and some updated field', async () => {
            await pMap(NOT_UPDATED_FIELDS, async (field) => {
                const {data: [user]} = await getUsers(LIMIT_PARAMS);
                const {data: [template]} = await getUserExerciseTemplates({
                    userId: user.id,
                    limitParams: LIMIT_PARAMS
                });
                const {data: [level]} = await getAllDifficultyLevels();

                const newTemplate = generateExerciseTemplate({
                    userId: template.userId!,
                    sportId: template.sportId!,
                    difficultyLevelId: level.id
                });

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
            await pMap(NOT_UPDATED_FIELDS, async (field) => {
                const {data: [user]} = await getUsers(LIMIT_PARAMS);
                const {data: [template]} = await getUserExerciseTemplates({
                    userId: user.id!,
                    limitParams: LIMIT_PARAMS
                });
                const {data: [level]} = await getAllDifficultyLevels();

                const newTemplate = generateExerciseTemplate({
                    userId: template.userId!,
                    sportId: template.sportId!,
                    difficultyLevelId: level.id
                });

                const {status} = await updateExerciseTemplate(template.id!, {[field]: newTemplate[field]});
                expect(status).to.equal(409);
            }, {concurrency: 1});
        });

        it('with not existing id', async () => {
            const {data, status} = await updateExerciseTemplate(NONEXISTENT_ID, {title: 'title'});
            expect(data).to.be.empty;
            expect(status).to.equal(200);
        });
    });

    describe('Delete template', () => {
        it('simple', async () => {
            const {data: [user]} = await getUsers(LIMIT_PARAMS);
            const {data: [template]} = await getUserExerciseTemplates({
                userId: user.id,
                limitParams: LIMIT_PARAMS
            });

            const {status} = await deleteExerciseTemplate(template.id!);
            expect(status).to.equal(409);

            const {data: exercises} = await getUserExercises({
                templateId: template.id,
                userId: user.id,
                limitParams: LIMIT_PARAMS
            });

            await pMap(exercises, async (exercise) => {
                await deleteExercise(exercise.id!);
            });

            const {data: [deletedTemplate]} = await deleteExerciseTemplate(template.id!);
            expect(deletedTemplate).to.deep.equal(template);

            const {data: templates} = await getExerciseTemplate(template.id!);
            expect(templates.length === 0).to.be.true;
        });
    });
});
