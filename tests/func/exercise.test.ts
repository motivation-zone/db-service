import {expect, assert} from 'chai';
import pMap from 'p-map';

import {
    dbActions as exerciseDbActions,
    generateExercise
} from 'tests/helpers/exercise';
import {dbActions as exerciseTemplateDbActions} from 'tests/helpers/exercise-template';
import {dbActions as userDbActions} from 'tests/helpers/user';
import {REQUIRED_FIELDS, NOT_UPDATED_FIELDS, IExerciseModel} from 'src/models/exercise';
import {checkOrder, checkAssertion} from 'tests/utils';
import {removeNotUpdatedFields} from 'src/utils';

const {
    insertExercise, getUserExercises,
    getExercise, updateExercise,
    deleteExercise
} = exerciseDbActions;
const {getUsers} = userDbActions;
const {getExerciseTemplates} = exerciseTemplateDbActions;

const NONEXISTENT_ID = '9607957f-9f02-4e55-bd36-8961dba1f694';
const LIMIT_PARAMS = {limit: 100, skip: 0};

describe('Exercise:', () => {
    describe('Create exercise', () => {
        it('simple', async () => {
            const {data: [user]} = await getUsers(LIMIT_PARAMS);
            const {data: [template]} = await getExerciseTemplates({
                userId: user.id,
                limitParams: LIMIT_PARAMS
            });

            const exercise = generateExercise(template.id!);
            const {data: [insertedExercise], status} = await insertExercise(exercise);
            expect(status).to.equal(200);

            expect(insertedExercise.id).to.be.ok;
            expect(insertedExercise.createdDate).to.be.ok;
            exercise.id = insertedExercise.id;
            exercise.createdDate = insertedExercise.createdDate;
            expect(insertedExercise).to.deep.equal(exercise);

            const {error: {message}, status: statusExistedTemplate} = await insertExercise(exercise);
            expect(statusExistedTemplate).to.equal(409);
            expect(message.includes('already exist')).to.be.true;
        });

        it('with nonexistent exerciseTemplateId', async () => {
            const exercise = generateExercise(NONEXISTENT_ID);
            const {error: {message}, status} = await insertExercise(exercise);
            expect(status).to.equal(409);
            expect(message.includes('is not present in table "exercise_template"')).to.be.true;
        });

        it('without required fields', async () => {
            const {data: [user]} = await getUsers(LIMIT_PARAMS);
            const {data: [template]} = await getExerciseTemplates({
                userId: user.id!,
                limitParams: LIMIT_PARAMS
            });

            await Promise.all(REQUIRED_FIELDS.map(async (field) => {
                const exercise = generateExercise(template.id!);
                delete exercise[field];

                const {error: {message}, status} = await insertExercise(exercise);

                expect(message).to.equal(`"${field}" is required`);
                expect(status).to.equal(400);
            }));
        });
    });

    describe('Get user exercises', () => {
        it('without limit params', async () => {
            const {data: [user]} = await getUsers(LIMIT_PARAMS);
            const {status} = await getUserExercises({
                userId: user.id,
                limitParams: {}
            });
            expect(status).to.equal(400);
        });

        it('all by template id', async () => {
            const {data: [user]} = await getUsers(LIMIT_PARAMS);
            const {data: exercises} = await getUserExercises({
                userId: user.id,
                limitParams: LIMIT_PARAMS
            });
            const {data: exercisesByTemplate} = await getUserExercises({
                userId: user.id,
                templateId: exercises[0].exerciseTemplateId,
                limitParams: LIMIT_PARAMS
            });

            exercisesByTemplate.forEach((exercise) => {
                expect(exercise.exerciseTemplateId).to.equal(exercises[0].exerciseTemplateId);
                expect(exercise.exerciseTemplate!.userId).to.equal(exercises[0].exerciseTemplate!.userId);
            });
        });

        it('all with order param = ASC', async () => {
            const {data: [user]} = await getUsers(LIMIT_PARAMS);
            const {data: exercises} = await getUserExercises({
                userId: user.id,
                limitParams: LIMIT_PARAMS
            });
            expect(exercises.length > 0).to.be.true;

            exercises.forEach((exercise) => expect(exercise.exerciseTemplate!.userId).to.equal(user.id!));

            const checkAsc = checkOrder(exercises, 'ASC', (exercise) => exercise.createdDate);
            expect(checkAsc).to.be.true;
        });

        it('all with order param = DESC', async () => {
            const {data: [user]} = await getUsers(LIMIT_PARAMS);
            const {data: exercises} = await getUserExercises({
                userId: user.id,
                limitParams: Object.assign({}, LIMIT_PARAMS, {order: 'DESC'})
            });
            expect(exercises.length > 0).to.be.true;

            exercises.forEach((exercise) => expect(exercise.exerciseTemplate!.userId).to.equal(user.id!));

            const checkAsc = checkOrder(exercises, 'DESC', (exercise) => exercise.createdDate);
            expect(checkAsc).to.be.true;
        });

        it('all by sport with order param = ASC', async () => {
            const {data: [user]} = await getUsers(LIMIT_PARAMS);
            const {data: [template]} = await getExerciseTemplates({
                userId: user.id,
                limitParams: LIMIT_PARAMS
            });

            const sportId = template.sportId;
            const {data: exercisesBySport} = await getUserExercises({
                userId: user.id!,
                sportId,
                limitParams: LIMIT_PARAMS
            });

            expect(exercisesBySport.length > 0).to.be.true;
            const check = exercisesBySport.every((exercise) => {
                expect(exercise.exerciseTemplate!.userId).to.equal(user.id!);
                return exercise.exerciseTemplate!.sportId === sportId;
            });
            expect(check).to.be.true;

            const checkAsc = checkOrder(exercisesBySport, 'ASC', (exercise) => exercise.createdDate);
            expect(checkAsc).to.be.true;
        });

        it('all by sport with order param = DESC', async () => {
            const {data: [user]} = await getUsers(LIMIT_PARAMS);
            const {data: [template]} = await getExerciseTemplates({
                userId: user.id,
                limitParams: LIMIT_PARAMS
            });

            const sportId = template.sportId;
            const {data: exercisesBySport} = await getUserExercises({
                userId: user.id,
                sportId,
                limitParams: Object.assign({}, LIMIT_PARAMS, {order: 'DESC'})
            });

            expect(exercisesBySport.length > 0).to.be.true;
            const check = exercisesBySport.every((exercise) => {
                expect(exercise.exerciseTemplate!.userId).to.equal(user.id!);
                return exercise.exerciseTemplate!.sportId === sportId;
            });
            expect(check).to.be.true;

            const checkDesc = checkOrder(exercisesBySport, 'DESC', (exercise) => exercise.createdDate);
            expect(checkDesc).to.be.true;
        });
    });

    describe('Get exercise', () => {
        it('by id', async () => {
            const {data: [user]} = await getUsers(LIMIT_PARAMS);
            const {data: [exercise]} = await getUserExercises({
                userId: user.id,
                limitParams: LIMIT_PARAMS
            });

            const {data: [gotExercise]} = await getExercise(exercise.id!);
            expect(exercise).to.deep.equal(gotExercise);
        });
    });

    describe('Update exercise', () => {
        it('simple', async () => {
            const {data: [user]} = await getUsers(LIMIT_PARAMS);
            const {data: [template]} = await getExerciseTemplates({
                userId: user.id,
                limitParams: LIMIT_PARAMS
            });

            const {data: [exercise]} = await getUserExercises({
                userId: user.id,
                limitParams: LIMIT_PARAMS
            });

            const newExercise = generateExercise(template.id!);

            const updatedFields = removeNotUpdatedFields(
                Object.keys(template),
                NOT_UPDATED_FIELDS
            ) as (keyof IExerciseModel)[];

            await pMap(updatedFields, async (field) => {
                await updateExercise(exercise.id!, {[field]: newExercise[field]});
                const {data: [checkExercise]} = await getExercise(exercise.id!);

                assert(
                    checkAssertion(checkExercise[field], newExercise[field]),
                    `${field}: ${checkExercise[field]} != ${newExercise[field]}`
                );
            }, {concurrency: 1});
        });

        it('with not updated fields and some updated field', async () => {
            const notUpdatedFields = NOT_UPDATED_FIELDS
                .join('&')
                .replace(/exerciseTemplate&?/gi, '')
                .split('&') as (keyof IExerciseModel)[];

            await pMap(notUpdatedFields, async (field) => {
                const {data: [user]} = await getUsers(LIMIT_PARAMS);
                const {data: [template]} = await getExerciseTemplates({
                    userId: user.id,
                    limitParams: LIMIT_PARAMS
                });
                const {data: [exercise]} = await getUserExercises({
                    userId: user.id,
                    limitParams: LIMIT_PARAMS
                });
                const newExercise = generateExercise(template.id!);

                await updateExercise(exercise.id!, {
                    [field]: newExercise[field],
                    // if send only not_updated_field => server remove it
                    // and send empty query => will be error 409 (next test)
                    value: newExercise.value
                });
                const {data: [checkExercise]} = await getExercise(exercise.id!);

                assert(
                    checkAssertion(checkExercise[field], exercise[field]),
                    `${checkExercise[field]} != ${exercise[field]}`
                );
                expect(checkExercise.value).to.equal(newExercise.value);
            }, {concurrency: 1});
        });

        it('with only not updated fields', async () => {
            await pMap(NOT_UPDATED_FIELDS, async (field) => {
                const {data: [user]} = await getUsers(LIMIT_PARAMS);
                const {data: [template]} = await getExerciseTemplates({
                    userId: user.id,
                    limitParams: LIMIT_PARAMS
                });
                const {data: [exercise]} = await getUserExercises({
                    userId: user.id,
                    limitParams: LIMIT_PARAMS
                });
                const newExercise = generateExercise(template.id!);

                const {status} = await updateExercise(exercise.id!, {[field]: newExercise[field]});
                expect(status).to.equal(409);
            }, {concurrency: 1});
        });

        it('with not existing id', async () => {
            const {data, status} = await updateExercise(NONEXISTENT_ID, {value: 111});
            expect(data).to.be.empty;
            expect(status).to.equal(200);
        });
    });

    describe('Delete exercise', () => {
        it('simple', async () => {
            it('simple', async () => {
                const {data: [user]} = await getUsers(LIMIT_PARAMS);
                const {data: [exercise]} = await getUserExercises({
                    userId: user.id,
                    limitParams: LIMIT_PARAMS
                });

                const {data: deletedExercises} = await deleteExercise(exercise.id!);
                expect(deletedExercises.length === 1).to.be.true;

                const {data: [deletedExercise]} = await getExercise(exercise.id!);
                expect(deletedExercise).to.be.not.ok;
            });
        });
    });
});
