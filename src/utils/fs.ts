import * as path from 'path';

export const getAbsolutePath = (filePath: string): string => {
    return path.resolve(process.cwd(), filePath);
};
