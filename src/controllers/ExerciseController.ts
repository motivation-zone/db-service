import * as express from 'express';
import ExerciseService from '../services/ExerciseService';
import HttpResponse from '../utils/http/HttpResponse';
import {getNotEmptyFields, checkGetLimitParameters} from '../utils/utils';


const exerciseController = express();

/* ------------TEMPLATE EXERCISE------------ */
exerciseController.get('/template/many/:userId/get', async (req: express.Request, res: express.Response) => {
    const {userId} = req.params;
    const {sportId} = req.query;

    const limitParameters = checkGetLimitParameters(req.query);
    if (!limitParameters) {
        return HttpResponse[400](res);
    }

    try {
        const result = await ExerciseService.getUserExerciseTemplates(limitParameters, userId, sportId);
        HttpResponse[200](res, result);
    } catch (e) {
        HttpResponse[409](res, e.message);
    }
});

exerciseController.post('/template/create', async (req: express.Request, res: express.Response) => {
    const {title, description, userId, sportId} = req.body;
    if (!title || !description || !userId || !sportId) {
        return HttpResponse[400](res);
    }

    try {
        const result = await ExerciseService.createExerciseTemplate({
            title, description, userId, sportId
        });
        HttpResponse[200](res, result);
    } catch (e) {
        HttpResponse[409](res, e.message);
    }
});

exerciseController.get('/template/:templateId/get', async (req: express.Request, res: express.Response) => {
    const {templateId} = req.params;

    try {
        const result = await ExerciseService.getExerciseTemplate(templateId);
        HttpResponse[200](res, result);
    } catch (e) {
        HttpResponse[409](res, e.message);
    }
});

exerciseController.delete('/template/:templateId/delete', async (req: express.Request, res: express.Response) => {
    const {templateId} = req.params;

    try {
        const result = await ExerciseService.deleteExerciseTemplate(templateId);
        HttpResponse[200](res, result);
    } catch (e) {
        HttpResponse[409](res, e.message);
    }
});

exerciseController.post('/template/:templateId/update', async (req: express.Request, res: express.Response) => {
    const fields = getNotEmptyFields(req.body, ['userId']);
    const {templateId} = req.params;

    try {
        const result = await ExerciseService.updateExerciseTemplate(
            templateId,
            fields,
            req.body
        );
        HttpResponse[200](res, result);
    } catch (e) {
        HttpResponse[409](res, e.message);
    }
});

/* ------------EXERCISE------------ */
exerciseController.get('/many/:userId/get', async (req: express.Request, res: express.Response) => {
    const {userId} = req.params;
    const {sportId} = req.query;

    const limitParameters = checkGetLimitParameters(req.query);
    if (!limitParameters) {
        return HttpResponse[400](res);
    }

    try {
        const result = await ExerciseService.getUserExercises(limitParameters, userId, sportId);
        HttpResponse[200](res, result);
    } catch (e) {
        HttpResponse[409](res, e.message);
    }
});

exerciseController.get('/:exerciseId/get', async (req: express.Request, res: express.Response) => {
    const {exerciseId} = req.params;

    try {
        const result = await ExerciseService.getExerciseById(exerciseId);
        HttpResponse[200](res, result);
    } catch (e) {
        HttpResponse[409](res, e.message);
    }
});

exerciseController.post('/create', async (req: express.Request, res: express.Response) => {
    const {exerciseTemplateId, duration, reps} = req.body;
    if (!exerciseTemplateId) {
        return HttpResponse[400](res);
    }

    try {
        const result = await ExerciseService.createExercise({
            exerciseTemplateId, duration, reps
        });
        HttpResponse[200](res, result);
    } catch (e) {
        HttpResponse[409](res, e.message);
    }
});

exerciseController.post('/:exerciseId/update', async (req: express.Request, res: express.Response) => {
    const fields = getNotEmptyFields(req.body);
    const {exerciseId} = req.params;

    try {
        const result = await ExerciseService.updateExercise(
            exerciseId,
            fields,
            req.body
        );
        HttpResponse[200](res, result);
    } catch (e) {
        HttpResponse[409](res, e.message);
    }
});

exerciseController.delete('/:exerciseId/delete', async (req: express.Request, res: express.Response) => {
    const {exerciseId} = req.params;

    try {
        const result = await ExerciseService.deleteExercise(exerciseId);
        HttpResponse[200](res, result);
    } catch (e) {
        HttpResponse[409](res, e.message);
    }
});

export default exerciseController;
