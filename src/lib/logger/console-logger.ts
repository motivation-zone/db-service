import {terminal} from 'terminal-kit';

const proxy: ILogger = {
    info: (msg: string) => {
        terminal.white(msg);
        terminal.nextLine(1);
    },
    warn: (msg: string) => {
        terminal.yellow(msg);
        terminal.nextLine(1);
    },
    error: (msg: string) => {
        terminal.red(msg);
        terminal.nextLine(1);
    },
    ok: (msg: string) => {
        terminal.green(msg);
        terminal.nextLine(1);
    }
};

export default proxy;
