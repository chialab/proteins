import Symbolic from './symbolic.js';
import { isFunction } from './types.js';

const SYM = Symbolic('listeners');

/**
 * Add a callback for the specified trigger.
 *
 * @param {Object} scope The event scope
 * @param {String} name The event name
 * @param {Function} callback The callback function
 * @return {Function} Destroy created listener with this function
 */
export function on(scope, name, callback) {
    if (!isFunction(callback)) {
        throw new TypeError('callback is not a function');
    }
    scope[SYM] = scope[SYM] || {};
    let callbacks = scope[SYM];
    let evtCallbacks = callbacks[name] = callbacks[name] || [];
    evtCallbacks.push(callback);
    return off.bind(null, scope, name, callback);
}
/**
 * Remove one or multiple listeners.
 *
 * @param {Object} scope The event scope
 * @param {String} [name] Optional event name to reset
 * @param {Function} [callback] Callback to remove (empty, removes all listeners).
 */
export function off(scope, name, callback) {
    if (callback) {
        let callbacks = scope[SYM];
        if (callbacks) {
            let evtCallbacks = callbacks[name] = callbacks[name] || [];
            let io = evtCallbacks.indexOf(callback);
            if (io !== -1) {
                evtCallbacks.splice(io, 1);
            }
        }
    } else if (name) {
        let callbacks = scope[SYM];
        if (callbacks) {
            delete callbacks[name];
        }
    } else {
        scope[SYM] = {};
    }
}

function flush(registered, callbacks, index, res, scope, ...args) {
    if (index === callbacks.length) {
        return (res instanceof Promise) ? res : Promise.resolve(res);
    }
    let callback = callbacks[index];
    if (registered.indexOf(callback) !== -1) {
        res = callback.call(scope, ...args);
    }
    res = (res instanceof Promise) ? res : Promise.resolve(res);
    return res.then(() =>
        flush(registered, callbacks, index + 1, res, scope, ...args)
    );
}

/**
 * Trigger a callback.
 *
 * @param {Object} scope The event scope
 * @param {String} name Event name
 * @param {...*} [args] Arguments to pass to callbacks
 * @return {Promise} The final Promise of the callbacks chain
 */
export function trigger(scope, name, ...args) {
    let callbacks = scope[SYM] || {};
    let evtCallbacks = callbacks[name] || [];
    return flush(evtCallbacks, evtCallbacks.slice(0), 0, null, scope, ...args);
}
