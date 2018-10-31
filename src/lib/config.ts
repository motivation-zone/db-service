import * as yaml from 'yaml';
import {getAbsolutePath} from '../utils/fs';
import * as fs from 'fs';
import env from './env';

const yamlConfig = fs.readFileSync(getAbsolutePath(`./configs/${env}.yaml`), 'utf8');
const config = yaml.parse(yamlConfig);

export default config;
