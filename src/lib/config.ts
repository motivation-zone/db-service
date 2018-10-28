import * as yaml from 'yaml';
import {getAbsolutePath} from '../utils/fs';
import * as fs from 'fs';
import env from './env';

const config = fs.readFileSync(getAbsolutePath(`./configs/${env}.yaml`), 'utf8');
const parsedConfig = yaml.parseDocument(config);

export default parsedConfig;
