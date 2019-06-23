import { TextChange } from 'typescript/lib/tsserverlibrary';

export function getTextChange(a: string, b: string): TextChange | undefined {
    if (!a.length) {
        if (!b.length) {
            return;
        }
        return {
            newText: b,
            span: {
                length: 0,
                start: 0
            }
        }
    }
    if (!b.length) {
        if (!a.length) {
            return;
        }
        return {
            newText: '',
            span: {
                length: a.length,
                start: 0
            }
        }
    }
    if (a.length === b.length) {
        return changeSwappingTextOrEq(a, b);
    }

    if (a.length > b.length) {
        return changeRemovingText(a, b);
    }

    return changeAddingText(a, b);
}

function changeAddingText(a: string, b: string): TextChange {
    let from = 0;
    while (true) {
        if (from === a.length) {
            /* b is bigger than a, seems like it was just adding at the end
             * a = 'ab'
             * b = 'abcd'
             * return {
             *     newText: 'abcd'.slice(2),
             *     span: {
             *         start: 2,
             *         length: 0 
             *     }
             * }
             */
            return {
                newText: b.slice(from),
                span: {
                    start: from,
                    // the change is 0, because we are changing replacing 0 characters from the end, just appending
                    length: 0
                }
            };
        }

        if (a[from] !== b[from]) {
            let aTo = a.length - 1;
            let bTo = b.length - 1;
            while (true) {
                if (aTo === from) {
                    /**
                     * we are replacing one character with more
                     * a = 'abc'
                     * b = 'adddc'
                     * return {
                     *     newText: 'adddc'.slice(1, 4),
                     *     span: {
                     *         start: 1,
                     *         length: 1
                     *     }
                     * };
                     */
                    return {
                        newText: b.slice(from, bTo),
                        span: {
                            start: from,
                            length: 1
                        }
                    };
                }

                if (a[aTo] !== b[bTo]) {
                    /**
                     * replacing multiples characters with other characters
                     * a = 'abcd'
                     * b = 'aeeeeed'
                     * return {
                     *     newText: 'aeeeeed'.slice(1, 5),
                     *     span: {
                     *         start: 1,
                     *         length: 2
                     *     }
                     * }
                     */
                    return {
                        newText: b.slice(from, bTo),
                        span: {
                            start: from,
                            length: a.length - aTo
                        }
                    }
                }
            }
        }
    }
}

function changeRemovingText(a: string, b: string): TextChange {
    let from = 0;
    while (true) {
        if (from === b.length) {
            /* a is bigger than b, seems like it was just deleting the last part
             * a = 'abcd'
             * b = 'ab'
             * return {
             *     newText: '',
             *     span: {
             *         start: 2,
             *         length: 2
             *     }
             * }
             */
            return {
                newText: '',
                span: {
                    start: from,
                    length: a.length - from
                }
            };
        }

        if (a[from] !== b[from]) {
            let aTo = a.length - 1;
            let bTo = b.length - 1;
            while (true) {
                if (bTo === from) {
                    /**
                     * same as before, i think this case doesn't exist actually, just in case
                     */
                    return {
                        newText: '',
                        span: {
                            start: from,
                            length: a.length - from
                        }
                    };
                }

                if (a[aTo] !== b[bTo]) {
                    /**
                     * found a difference in the middle of the text
                     * a = 'abcde'
                     * b = 'a00e'
                     * return {
                     *     newText: '00',
                     *     span: {
                     *         start: 1,
                     *         length: 3
                     *     }
                     * };
                     */
                    return {
                        newText: b.slice(from, bTo),
                        span: {
                            start: from,
                            length: aTo - from
                        }
                    };
                }
                aTo--;
                bTo--;
            }
        }



        from++;
        if (from === a.length) {
            throw new Error('Unreachable');
        }
    }
}

function changeSwappingTextOrEq(a: string, b: string): TextChange | undefined {
    const length = a.length;
    for (let from = 0; from < length; from++) {
        if (a[from] !== b[from]) {
            for (let to = length - 1; to > from; to--) {
                if (a[to] !== b[to]) {
                    return {
                        newText: b.slice(from, to),
                        span: {
                            start: from,
                            length: to - from
                        }
                    };
                }
            }

            throw new Error('Unreachable');
        }
    }

}

function loopBackward(a: string, b: string, min: number) {
    let i = a.length - 1;
    let j = b.length - 1;
    for (
        let counter = 0;
        i > min && j > min;
        j++ , i++ , counter++
    ) {
        if (a[i] !== b[j]) {
            return counter;
        }
    }
    if (i === min) {

    }

}


function loopForward(a: string, b: string) {
    const max = Math.min(a.length, b.length);
    for (let i = 0; i < max; i++) {
        if (a[i] !== b[i]) {
            return i;
        }
    }
    return -1;
}