import * as pg from 'pg';
import * as fs from 'fs';
import * as yaml from 'yaml';
import logger from '../logger/logger';
import {getAbsolutePath} from '../../utils/fs';
import DBError from '../../utils/db/DBError';

interface IQuery {
    text: string;
    values: any[];
}

const dbErrorHandler = (err: Error, client: pg.PoolClient) => {
    logger('error', 'db', err.stack || '');
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

export const query = async (queryData: IQuery) => {
    let client;
    let data;

    try {
        client = await pool.connect();
        data = await client.query(queryData);
    } catch (e) {
        logger('error', 'db', e.message);
        throw new DBError(e.detail, e.message);
    } finally {
        if (client) {
            client.release();
        }
    }
    return data && data.rows || [];
};

export const forceCloseConnection = async () => {
    pool.end();
};
