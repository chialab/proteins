import symbolic from './symbolic.js';
import { isFunction } from './types.js';
const SYM = symbolic('listeners');

/**
 * Add a callbacks for the specified trigger.
 *
 * @param {*} scope The event scope
 * @param {String} name The event name
 * @param {Function} callback The callback function
 * @return {Function} Destroy created listener with this function
 */
export function on(scope, name, callback) {
    if (!isFunction(callback)) {
        throw new TypeError('callback is not a function');
    }
    if (!SYM.has(scope)) {
        SYM(scope, {});
    }
    let callbacks = SYM(scope);
    let evtCallbacks = callbacks[name] = callbacks[name] || [];
    evtCallbacks.push(callback);
    return off.bind(null, scope, name, callback);
}
/**
 * Remove one or all listeners.
 *
 * @param {*} scope The event scope
 * @param {String} name Optional event name to reset
 * @param {Function} callback Optional callback to remove (empty, removes all listeners).
 */
export function off(scope, name, callback) {
    if (callback) {
        let callbacks = SYM(scope);
        if (callbacks) {
            let evtCallbacks = callbacks[name] = callbacks[name] || [];
            let io = evtCallbacks.indexOf(callback);
            if (io !== -1) {
                evtCallbacks.splice(io, 1);
            }
        }
    } else if (name) {
        let callbacks = SYM(scope);
        if (callbacks) {
            delete callbacks[name];
        }
    } else {
        SYM(scope, {});
    }
}
/**
 * Trigger a callback.
 *
 * @param {*} scope The event scope
 * @param {String} name Event name
 * @param {Array} ...args Arguments to pass to callback functions
 * @exec callback functions
 * @return {Promise}
 */
export function trigger(scope, name, ...args) {
    let callbacks = SYM(scope);
    if (callbacks) {
        let evtCallbacks = callbacks[name] || [];
        let promise = Promise.resolve();
        evtCallbacks.forEach((callback) => {
            promise = promise.then(() => callback.call(scope, ...args));
        });
        return promise;
    }
}
