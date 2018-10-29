import * as debug from 'debug';

export type LevelType = 'error' | 'info';

type DebugFunction = (msg: string) => {};

interface IDebugTarget {
    error: DebugFunction;
    info: DebugFunction;
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
