import { dirname } from "path";

const fs = require('fs');
const util = require('util');
const path = require('path');
const mkdir = util.promisify(fs.mkdir);
const readdir = util.promisify(fs.readdir);
const stat = util.promisify(fs.stat);
const createReadStream = fs.createReadStream;
const createWriteStream = fs.createWriteStream;
const { copyFile, flush, promise } = createFileQueue();
if (!module.parent) {
    const from = path.resolve(process.argv[2]);
    const to = path.resolve(process.argv[3]);
    cp(from, to)
        .then(flush)
        .then(() => promise)
        .catch(err => {
            console.error(err);
            process.exit(1);
        });
}

export function cp(from: string, to: string) {
    return Promise.all([stat(from), stat(to).catch(noop)]).then(([statFrom, statTo]) => {
        if (statFrom.isDirectory()) {
            if (!statTo) {
                return ensureDir(to).then(() => copyDirectory(from, to));
            }
            return copyDirectory(from, to);
        } else {
            ensureDir(dirname(to)).then(() => copyFile(from, to));
        }
    });
}

export function ensureDir(to: string) {
    return mkdir(to).catch(err => {
        if (err.code === 'ENOENT') {
            return ensureDir(path.dirname(to)).then(() => ensureDir(to));
        }

        if (err.code === 'EEXIST') {
            return;
        }
        console.error(err);
        throw err;
    });
}

function noop() { }

function copyDirectory(from, to) {
    return readdir(from).then(files => Promise.all([files.map(cur => cp(path.join(from, cur), path.join(to, cur)))]));
}

function createFileQueue() {
    const queue = [];
    let resolve, reject;
    const promise = new Promise((res, rej) => {
        resolve = res;
        reject = rej;
    });
    let running = 0;
    let flushed = false;
    let errored = false;
    return {
        promise,
        flush,
        copyFile
    };
    function flush() {
        flushed = true;
        if (!running && !queue.length) {
            resolve();
        }
    }
    function copyFile(from: string, to: string) {
        if (errored) {
            return;
        }
        if (from.indexOf('node_modules') !== -1) {
            _handleNodeModules(from, to);
        } else {
            _copyFile(from, to);
        }
    }
    function onError(err: any) {
        if (errored) {
            return;
        }
        reject(err);
        errored = true;
    }
    function onClose() {
        if (errored) {
            return;
        }
        running--;
        if (queue.length) {
            copyFile.apply(null, queue.shift());
        } else if (!running && flushed) {
            resolve();
        }
    }

    function _copyFile(from: string, to: string) {
        if (running === 20) {
            queue.push([from, to]);
            return;
        }
        running++;
        createReadStream(from)
            .pipe(createWriteStream(to))
            .on('close', onClose)
            .on('error', onError);
    }

    function _handleNodeModules(from: string, to: string) {
        return stat(to).catch(() => _copyFile(from, to));
    }
}
