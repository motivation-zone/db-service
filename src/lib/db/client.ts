import * as pg from 'pg';
import * as fs from 'fs';
import * as yaml from 'yaml';
import logger from '../logger/logger';
import {getAbsolutePath} from '../../utils/fs';

interface IQuery {
    text: string;
    values: any[];
}

interface IErrorData {
    detail: string;
    error: string;
}

export interface IResultError {
    status: 'error';
    data: IErrorData;
}

export interface IResultSuccess {
    status: 'ok';
    data: any[];
}

const dbErrorHandler = (err: string) => {
    logger('error', 'db', err);
}

const yamlDbConfig = fs.readFileSync(getAbsolutePath(`./configs/db/db.yaml`), 'utf8');
const dbConfig = yaml.parse(yamlDbConfig);
const {Pool} = pg;

const config = {
    host: dbConfig.host,
    user: dbConfig.user,
    password: dbConfig.password,
    database: dbConfig.database,
    port: dbConfig.port,
    idleTimeoutMillis: 1000 * 60 * 2,
    connectionTimeoutMillis: 2000,
};

const pool = new Pool(config);
pool.on('error', dbErrorHandler);

export const query = async (queryData: IQuery): Promise<IResultError | IResultSuccess> => {
    let client;
    let result = {} as IResultSuccess | IResultError;

    try {
        client = await pool.connect();
        const data = await client.query(queryData);
        result = {
            status: 'ok',
            data: data.rows || []
        };
    } catch (e) {
        result = {
            status: 'error',
            data: {
                detail: e.detail,
                error: e.message
            }
        };
        logger('error', 'db', e.message);
    } finally {
        if (client) {
            client.release();
        }
    }

    return result;
};

export const forceCloseConnection = async () => {
    pool.end();
};
