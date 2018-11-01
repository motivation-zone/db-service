import * as fs from 'fs';
import { getAbsolutePath } from '../utils/fs';

interface IISOCountry {
    name: string;
    iso: string;
}

const isoData = (JSON.parse(
    fs.readFileSync(getAbsolutePath('./res/country-iso.json')).toString()
) as IISOCountry[]).map((x) => x.iso);

export const checkCountry = (name?: string): boolean => {
    if (!name) {
        return true;
    }

    return isoData.includes(name);
};
