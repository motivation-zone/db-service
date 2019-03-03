import yaml from 'yaml';
import fs from 'fs';

import {getAbsolutePath} from 'src/utils/fs';
import env from 'src/lib/env';

const yamlConfig = fs.readFileSync(getAbsolutePath(`./configs/${env}.yaml`), 'utf8');
const config = yaml.parse(yamlConfig);

export default config;
