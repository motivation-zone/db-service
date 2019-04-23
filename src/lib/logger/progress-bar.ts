import {terminal} from 'terminal-kit';

export default class ProgressBar {
    private _total: number;
    private _current: number;
    private _title: string | null;
    private _interval: NodeJS.Timer | null;

    constructor() {
        this._total = 0;
        this._current = 0;
        this._interval = null;
        this._title = null;

        this._do = this._do.bind(this);
    }

    start(total: number) {
        this._total = total;
        this._interval = setInterval(this._do, 300);
    }

    update(current: number, title: string) {
        this._current = current;
        this._title = title;

        this._do();
    }

    stop() {
        if (!this._interval) {
            return;
        }

        clearInterval(this._interval);
    }

    static fillProgressBarLine(total: number, current: number): string {
        const length = Math.trunc(terminal.width / 2);
        const result = new Array(length).fill(' ');

        const part = current / total;
        const fillItemsCount = Math.round(length * part);

        result.splice(0, fillItemsCount, ...new Array(fillItemsCount).fill('='))

        return result.join('');
    }

    static getProgressBarTitle(title: string): string {
        const length = Math.trunc(terminal.width / 3);
        const result = new Array(length).fill(' ');
        const trimmed = title.split('').splice(0, length);

        result.splice(0, trimmed.length - 1, ...trimmed);

        return result.join('');
    }

    private _do() {
        const msg = [
            `${ProgressBar.getProgressBarTitle(this._title!)}`,
            `[${ProgressBar.fillProgressBarLine(this._total, this._current)}]`,
            `${Math.trunc(this._current / this._total * 100)}%`,
            `${this._current}/${this._total}`
        ].join(' ');

        terminal.white(msg);
        terminal.nextLine(1);
        terminal.previousLine(1);
        terminal.hideCursor();
    }
}
