import debug from 'debug';

export type LevelType = 'error' | 'info';

export interface IDebugTarget {
    error: (msg: string) => void;
    info: (msg: string) => void;
}

/**
 * Console debug logger
 */
const proxy = new Proxy<IDebugTarget>({} as IDebugTarget, {
    get(target: IDebugTarget, prop: LevelType) {
        return prop in target ? target[prop] : target[prop] = debug(`dbservice:${prop}`);
    }
});

export default proxy;
