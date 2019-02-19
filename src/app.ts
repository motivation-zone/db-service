import * as express from 'express';
import * as bodyParser from 'body-parser';

import logger from './lib/logger';
import notFoundMiddleware from './middleware/not-found';
import errorMiddleware from './middleware/error';

import controllers from './controllers';
const {
    CountryController,
    DifficultyLevelController,
    ExerciseController,
    ProgramController,
    SportController,
    TrainingTypeController,
    TrainingController,
    UserController
} = controllers;

import {API_URLS} from './urls';

const {
    user,
    country,
    sport,
    difficultyLevel,
    exercise,
    program,
    trainingType,
    training
} = API_URLS;

const app = express()
    .disable('x-powered-by')
    .use(bodyParser.urlencoded({extended: false}))
    .use(bodyParser.json())
    .get('/ping', (_req, res) => res.end())
    .use(user.prefix, UserController)
    .use(country.prefix, CountryController)
    .use(sport.prefix, SportController)
    .use(difficultyLevel.prefix, DifficultyLevelController)
    .use(exercise.prefix, ExerciseController)
    .use(program.prefix, ProgramController)
    .use(trainingType.prefix, TrainingTypeController)
    .use(training.prefix, TrainingController)
    .use(notFoundMiddleware)
    .use(errorMiddleware);

if (!module.parent) {
    const envPort = Number(process.env.NODEJS_PORT);
    const port: number = isNaN(envPort) ? 8080 : envPort;
    app.listen(port, () => {
        logger('info', 'app', `Application started on port ${port}`);
    });
}

export default app;
