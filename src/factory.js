import mix from './mixin.js';
import internal from './internal.js';
import keypath from './keypath.js';
import clone from './clone.js';
import { isArray, isObject, isString } from './types.js';
import { on, off, trigger } from './events.js';


export class BaseObservable {}

export const ObservableMixin = (SuperClass) => class extends SuperClass {
    /**
     * Add a callbacks for the specified trigger.
     *
     * @param {String} name The event name
     * @param {Function} callback The callback function
     * @return {Function} Destroy created listener with this function
     */
    on(name, callback) {
        return on(this, name, callback);
    }
    /**
     * Remove one or all listeners.
     *
     * @param {String} name Optional event name to reset
     * @param {Function} callback Optional callback to remove (empty, removes all listeners).
     */
    off(name, callback) {
        return off(this, name, callback);
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
        return trigger(this, name, ...args);
    }
};

export class Observable extends mix(BaseObservable).with(ObservableMixin) { }

export const ConfigurableMixin = (SuperClass) => class extends SuperClass {
    get defaultConfig() {
        return {};
    }

    constructor(config) {
        super(config);
        this.internal().config = clone(this.defaultConfig);
        if (config) {
            this.config(config);
        }
    }

    config(config, val) {
        if (isString(config)) {
            return this.config({
                [config]: val,
            });
        }
        let current = this.internal().config;
        if (isObject(config)) {
            for (let k in config) {
                let oldValue = keypath(current, k);
                let newValue = config[k];
                if (oldValue !== newValue) {
                    keypath(current, k, newValue);
                    this.trigger('config:changed', k, oldValue, newValue);
                }
            }
        }
        return current;
    }
};

export class BaseFactory extends mix(BaseObservable).with(ObservableMixin, ConfigurableMixin) {}

export const FactoryMixin = (SuperClass) => class extends SuperClass {
    static init(...args) {
        let obj = new this(...args);
        return obj.initialize(...args);
    }

    internal() {
        return internal(this);
    }

    setContext(ctx) {
        this.internal().ctx = ctx;
    }

    getContext() {
        return this.internal().ctx || this;
    }

    initialize() {
        this.internal().initialized = true;
        return Promise.resolve(this);
    }

    init(Class, ...args) {
        let obj = new Class(...args);
        obj.setContext(this.getContext());
        if (obj.internal().initialized) {
            return Promise.resolve(obj);
        }
        return obj.initialize(...args);
    }

    isDestroyed() {
        return !internal.has(this);
    }

    destroy() {
        internal.destroy(this);
        return Promise.resolve();
    }
};

export const InjectableMixin = (SuperClass) => class extends SuperClass {
    static get injectors() {
        return {};
    }

    initialize(...args) {
        this.internal().injected = {};
        return super.initialize(...args)
            .then(() =>
                this.beforeInjection(...args)
                    .then((injectors) =>
                        this.inject(injectors)
                    )
                    .then(() => this.afterInjection())
            ).then(() =>
                Promise.resolve(this)
            );
    }

    beforeInjection() {
        return Promise.resolve([
            this.constructor.injectors,
        ]);
    }

    afterInjection() {
        return Promise.resolve();
    }

    injected() {
        return this.internal().injected;
    }

    inject(inject, Fn) {
        let promise = Promise.resolve();
        if (isArray(inject)) {
            inject.forEach((injs) => {
                promise = promise.then(() => this.inject(injs));
            });
        } else if (isObject(inject)) {
            for (let name in inject) {
                promise = promise.then(() => this.inject(name, inject[name]));
            }
        } else {
            let resolve = Promise.resolve(Fn);
            let contextInjected = this.getContext().injected();
            if (contextInjected.hasOwnProperty(inject)) {
                resolve = Promise.resolve(contextInjected[inject]);
            } else {
                let args = [];
                if (isArray(Fn)) {
                    args = Fn.slice(1);
                    Fn = Fn[0];
                }
                resolve = this.init(Fn, ...args);
            }
            promise = resolve
                .then((fn) => {
                    contextInjected[inject] = fn;
                    this.internal().injected[inject] = fn;
                    return this.trigger('inject:ready', inject, fn);
                });
        }
        return promise;
    }

    factory(name) {
        let injected = this.getContext().injected();
        return injected && injected[name];
    }
};

export class Factory extends mix(BaseFactory).with(FactoryMixin, InjectableMixin) {
    initialize(...args) {
        this.internal().listenTo = [];
        return super.initialize(...args);
    }

    listen(obj, name, callback) {
        this.internal().listenTo.push(
            on(obj, name, callback)
        );
    }

    unlisten(obj, name, callback) {
        if (obj) {
            off(obj, name, callback);
        } else {
            this.internal().listenTo.forEach((offListener) => offListener());
            this.internal().listenTo = [];
        }
    }

    destroy() {
        this.off();
        this.unlisten();
        return super.destroy();
    }
}
