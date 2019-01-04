import * as express from 'express';
import * as bodyParser from 'body-parser';
import logger from './lib/logger/logger';
import UserController from './controllers/UserController';
import CountryController from './controllers/CountryController';
import SportController from './controllers/SportController';
import DifficultyLevelController from './controllers/DifficultyLevelController';
import ExerciseController from './controllers/ExerciseController';

const app = express()
    .disable('x-powered-by')
    .use(bodyParser.urlencoded({extended: false}))
    .use(bodyParser.json())
    .get('/ping', (req, res) => res.end())
    .use('/api/user/', UserController)
    .use('/api/country/', CountryController)
    .use('/api/sport/', SportController)
    .use('/api/difficulty-level/', DifficultyLevelController)
    .use('/api/exercise', ExerciseController)
    .use((req, res, next) => res.status(404).json({error: 'endpoint not found'}))
    .use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
        res.status(500).send('Server error');
    });

export default app;

if (!module.parent) {
    const envPort = Number(process.env.NODEJS_PORT);
    const port: number = isNaN(envPort) ? 8080 : envPort;
    app.listen(port, () => {
        logger('info', 'app', `Application started on port ${port}`);
    });
}
