import {terminal} from 'terminal-kit';

const proxy: ILogger = {
    info: (msg: string) => {
        terminal.nextLine(1);
        terminal.white(msg);
        terminal.nextLine(1);
    },
    warn: (msg: string) => {
        terminal.nextLine(1);
        terminal.yellow(msg);
        terminal.nextLine(1);
    },
    error: (msg: string) => {
        terminal.nextLine(1);
        terminal.red(msg);
        terminal.nextLine(1);
    },
    ok: (msg: string) => {
        terminal.nextLine(1);
        terminal.green(msg);
        terminal.nextLine(1);
    }
};

export default proxy;
