import * as pg from 'pg';
import * as fs from 'fs';
import * as yaml from 'yaml';
import logger from '../logger/logger';
import {getAbsolutePath} from '../../utils/fs';

interface IQuery {
    text: string;
    values: any[];
}

const dbErrorHandler = (err: string) => {
    logger('error', 'db', err);
}

const yamlDbConfig = fs.readFileSync(getAbsolutePath(`./configs/db/db.yaml`), 'utf8');
const dbConfig = yaml.parseDocument(yamlDbConfig);
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
    let result;

    try {
        client = await pool.connect();
        result = await client.query(queryData);
    } catch (e) {
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
