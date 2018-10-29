import * as express from 'express';
import consoleLogger from './lib/console-logger';
import userController from './controllers/UserController';

const app = express()
    .disable('x-powered-by')
    .get('/ping', (req, res) => res.end())
    .use('/api/user/', userController)
    .use((req, res, next) => res.status(404).send('Not found'))
    .use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
        res.status(500).send('Server error');
    });

export default app;

if (!module.parent) {
    const envPort = Number(process.env.NODEJS_PORT);
    const port: number = isNaN(envPort) ? 8080 : envPort;
    app.listen(port, () => {
        consoleLogger['info'](`Application started on port ${port}`);
    });
}
