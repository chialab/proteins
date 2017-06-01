import mix from './mixin.js';
import symbolic from './symbolic.js';
const SYM = symbolic('listeners');

export class BaseObservable {}

export const ObservableMixin = (SuperClass) => class extends SuperClass {
    constructor(...args) {
        super(...args);
        SYM(this, {});
    }
    /**
     * Add a callbacks for the specified trigger.
     *
     * @param {String} name The event name
     * @param {Function} callback The callback function
     * @return {Function} Destroy created listener with this function
     */
    on(name, callback) {
        if (typeof callback !== 'function') {
            throw new Error('Callback is not a function.');
        }
        let callbacks = SYM(this);
        let evtCallbacks = callbacks[name] = callbacks[name] || [];
        evtCallbacks.push(callback);
        return this.off.bind(this, name, callback);
    }
    /**
     * Remove one or all listeners.
     *
     * @param {String} name Optional event name to reset
     * @param {Function} callback Optional callback to remove (empty, removes all listeners).
     */
    off(name, callback) {
        if (callback) {
            let callbacks = SYM(this);
            let evtCallbacks = callbacks[name] = callbacks[name] || [];
            let io = evtCallbacks.indexOf(callback);
            if (io !== -1) {
                evtCallbacks.splice(io, 1);
            }
        } else if (name) {
            let callbacks = SYM(this);
            if (callbacks) {
                delete callbacks[name];
            }
        } else {
            SYM(this, {});
        }
    }
    /**
     * Trigger a callback.
     *
     * @param {String} name Event name
     * @param {Array} ...args Arguments to pass to callback functions
     * @exec callback functions
     * @return {Promise}
     */
    trigger(name, ...args) {
        let callbacks = SYM(this) || {};
        let evtCallbacks = callbacks[name] || [];
        let promise = Promise.resolve();
        evtCallbacks.forEach((callback) => {
            promise = promise.then(() => callback.call(this, ...args));
        });
        return promise;
    }
};

export class Observable extends mix(BaseObservable).with(ObservableMixin) {}
