export function isPatchedWith(symb: symbol, val: any) {
    return !!getPatchedValue(symb, val);
}

export function getPatchedValue<T = any>(symb: symbol, val: any): T {
    return (val && val[symb]);
}

export function patchWith<T>(symb: symbol, val: any, patchValue: T): T {
    return val[symb] = patchValue;
}