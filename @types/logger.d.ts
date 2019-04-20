type LoggerType = 'app' | 'db';

interface ILogger {
    info: (msg: string) => void;
    warn: (msg: string) => void;
    error: (msg: string) => void;
    ok: (msg: string) => void;
}
