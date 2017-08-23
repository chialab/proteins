import Symbolic from './symbolic.js';

const CONTEXT_SYM = new Symbolic('context');

let currentCtx;

export function setContext(object, context = currentCtx) {
    if (context) {
        object[CONTEXT_SYM] = context;
    } else {
        delete object[CONTEXT_SYM];
    }
}

export function getContext(object) {
    return object[CONTEXT_SYM];
}

export function init(ctx, Factory, ...args) {
    currentCtx = getContext(ctx) || ctx;
    let res = new Factory(...args);
    currentCtx = null;
    return res;
}
