import debug from 'debug';

export type LevelType = 'error' | 'info' | 'tests';

export interface IDebugTarget {
    error: (msg: string) => void;
    info: (msg: string) => void;
    tests: (msg: string) => void;
}

/**
 * Console debug logger
 */
const proxy = new Proxy<IDebugTarget>({} as IDebugTarget, {
    get(target: IDebugTarget, prop: LevelType): Function {
        return prop in target ? target[prop] : target[prop] = debug(`dbservice:${prop}`);
    }
});

export default proxy;
