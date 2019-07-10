import { appendFile } from 'fs-extra';
Function('return this;')().log = function (...args: any[]) {
    appendFile('e:/logs.txt', args.map(toString).join(' ') + '\r\n');
}

function toString(val: any) {
    switch (typeof val) {
        case 'string':
        case 'number':
        case 'boolean':
        case 'function':
        case 'undefined':
            return val + ''
        default:
            if (!val) {
                return 'null';
            }

            if (val instanceof Error) {
                return JSON.stringify({
                    name: val.name,
                    message: val.message,
                    stack: val.stack,
                }, null, '  ');
            }

            return JSON.stringify(val, null, '\t');
    }
}