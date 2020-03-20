import Symbolic from './symbolic.js';
import has from './has.js';
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

/**
 * Trigger a callback.
 *
 * @param {Object} scope The event scope
 * @param {String} name Event name
 * @param {...*} args Arguments to pass to callbacks
 * @return {Promise} The final Promise of the callbacks chain
 */
export function trigger(scope, name, ...args) {
    const callbacksList = (has(scope, SYM) && has(scope[SYM], name) && scope[SYM][name]) || [];
    let finalResults = callbacksList
        .slice(0)
        .reduce((results, callback) => {
            if (callbacksList.indexOf(callback) === -1) {
                // the callback has been removed from the callback list.
                return results;
            }
            let lastResult = results[results.length - 1];
            let result;
            if (lastResult instanceof Promise) {
                // wait for the previous result.
                result = lastResult.then(() => callback.call(scope, ...args));
            } else {
                result = callback.call(scope, ...args);
            }
            results.push(result);
            return results;
        }, []);

    return Promise.all(finalResults);
}
