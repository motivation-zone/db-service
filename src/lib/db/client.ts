import * as pg from 'pg';
import * as fs from 'fs';
import * as yaml from 'yaml';
import Boom from 'boom';

import logger from '../logger';
import {getAbsolutePath} from '../../utils/fs';
import HttpResponse from '../../utils/http/response';

interface IQuery {
    text: string;
    values: any[];
}

const dbErrorHandler = (err: Error, _client: pg.PoolClient) => {
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
        HttpResponse.error(Boom.conflict, `${e.detail} ${e.message}`);
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
