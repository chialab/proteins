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

/**
 * Queue event callbacks.
 * @private
 *
 * @param {Array<Function>} registered A list of registered callbacks.
 * @param {Array<Function>} callbacks A list of callbacks to exec.
 * @param {integer} index The callbacks iterator.
 * @param {*} res The previous callback response.
 * @param {*} context The callback context.
 * @param {*} args A list of arguments for the callback.
 */
function flush(registered, callbacks, index, res, context, ...args) {
    if (index === callbacks.length) {
        return (res instanceof Promise) ? res : Promise.resolve(res);
    }
    let callback = callbacks[index];
    if (registered.indexOf(callback) !== -1) {
        res = callback.call(context, ...args);
    }
    if (res instanceof Promise) {
        return res.then(() =>
            flush(registered, callbacks, index + 1, res, context, ...args)
        );
    }
    return flush(registered, callbacks, index + 1, res, context, ...args);
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
    if (scope.hasOwnProperty(SYM) && scope[SYM].hasOwnProperty(name)) {
        return flush(scope[SYM][name], scope[SYM][name].slice(0), 0, null, scope, ...args);
    }
}
