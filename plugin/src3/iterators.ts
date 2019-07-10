export function reduceIterator<T, U>(iterator: Iterator<T>, reducer: (prev: U[], val: T, index: number) => U[], thisArg: any = null): Iterator<U> {
    let prev: U[] = [];
    let index = 0;
    let doneIterating = false;
    return {
        next: function () {
            if (!doneIterating) {
                const { done, value } = iterator.next();
                if (done) {
                    doneIterating = true;
                } else if (!(prev = reducer.call(thisArg, prev, value, index)) || !Array.isArray(prev)) {
                    throw new Error('Reducer didn\'t return an array');
                }
            }
            if (index === prev.length) {
                return {
                    done: true,
                    value: undefined as any
                }
            }

            return {
                done: false,
                value: prev[index++]
            }
        }
    };
}

export function arrayIterator<T>(array: ReadonlyArray<T>): Iterator<T> {
    let i = 0;
    return {
        next: () => {
            if (i === array.length) {
                return { value: undefined as never, done: true };
            }
            else {
                i++;
                return { value: array[i - 1], done: false };
            }
        }
    };
}

export function mapIterator<T, U>(iter: Iterator<T>, mapFn: (x: T) => U, thisArg?: any): Iterator<U> {
    return {
        next() {
            const iterRes = iter.next();
            return iterRes.done ? iterRes as any : { value: mapFn.call(thisArg, iterRes.value), done: false };
        }
    };
}

export function tapIterator<T>(iter: Iterator<T>, mapper: (this: any, val: T) => void, thisArgs: any = null as any): Iterator<T> {
    return {
        next: function () {
            const cur = iter.next();
            if (!cur.done) {
                mapper.call(thisArgs, cur.value);
            }
            return cur;
        }
    }
}

export function isIterator(val: any): val is Iterator<any> {
    return val && typeof val.next === 'function';
}

