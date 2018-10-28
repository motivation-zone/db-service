import * as debug from 'debug';
import env from './env';

type DebugType = 'error' | 'info';
type DebugFunction = (msg: string) => {};

interface IDebugTarget {
    error: DebugFunction;
    info: DebugFunction;
}

/**
 * Console debug logger
 */
const proxy = new Proxy<IDebugTarget>({} as IDebugTarget, {
    get(target: IDebugTarget, prop: DebugType) {
        if (env !== 'development') {
            return function () {
                // do nothing.
            };
        }

        return prop in target ? target[prop] : target[prop] = debug(`dbservice:${prop}`);
    }
});

export default proxy;
