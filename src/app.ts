import express, {Request, Response} from 'express';
import bodyParser from 'body-parser';

import logger from 'src/lib/logger';
import notFoundMiddleware from 'src/middleware/not-found';
import errorMiddleware from 'src/middleware/error';

import controllers from 'src/controllers';
const {
    CountryController,
    DifficultyLevelController,
    ExerciseController,
    ExerciseTemplateController,
    SportController,
    UserController
} = controllers;

import {apiUrls} from './urls';

const {
    user,
    country,
    sport,
    difficultyLevel,
    exercise,
    exerciseTemplate
} = apiUrls;

const app = express()
    .disable('x-powered-by')
    .use(bodyParser.urlencoded({extended: false}))
    .use(bodyParser.json())
    .get('/ping', (_req: Request, res: Response) => res.end())
    .use(user.prefix, UserController)
    .use(country.prefix, CountryController)
    .use(sport.prefix, SportController)
    .use(difficultyLevel.prefix, DifficultyLevelController)
    .use(exercise.prefix, ExerciseController)
    .use(exerciseTemplate.prefix, ExerciseTemplateController)
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
