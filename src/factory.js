import mix from './mixin.js';
import internal from './internal.js';
import symbolic from './symbolic.js';
import * as keypath from './keypath.js';
import clone from './clone.js';
import { isArray, isObject, isString } from './types.js';
import { on, off, trigger } from './events.js';

/**
 * A set of classes with super powers.
 * For direct or extended use.
 *
 * @module Factory
 */

/**
 * Symbol for Factory configuration.
 * @memberof Factory
 * @type Function
 */
export const CONFIG_SYM = symbolic('config');

/**
 * Factory base class.
 * @private
 * @class Base
 * @memberof Factory
 */
class Base {
    internal() {
        return internal(this);
    }

    destroy() {
        internal.destroy(this);
        return Promise.resolve();
    }

    isDestroyed() {
        return !internal.has(this);
    }
}

/**
 * Events emitter mixin.
 * @memberof Factory
 * @mixin ObservableMixin
 */
export const ObservableMixin = (SuperClass) => class extends SuperClass {
    constructor(...args) {
        super(...args);
        this.internal().listenTo = [];
    }

    on(name, callback) {
        return on(this, name, callback);
    }

    off(name, callback) {
        return off(this, name, callback);
    }

    trigger(name, ...args) {
        return trigger(this, name, ...args);
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
};

/**
 * Mixin for other multiple injections.
 * @memberof Factory
 * @mixin InjectableMixin
 */
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

/**
 * @class Observable
 * @memberof Factory
 * @extends Base
 * @implements ObservableMixin
 */
export class Observable extends mix(Base).with(ObservableMixin) { }

export const ConfigurableMixin = (SuperClass) => class extends SuperClass {
    get defaultConfig() {
        return {};
    }

    constructor(config) {
        super(config);
        CONFIG_SYM(this, clone(this.defaultConfig || {}));
        if (config) {
            this.config(config);
        }
    }

    config(config, ...args) {
        let current = CONFIG_SYM(this);
        if (args.length === 0 && isString(config)) {
            return keypath.get(current, config);
        }
        if (isString(config)) {
            return this.config({
                [config]: args[0],
            });
        }
        if (isObject(config)) {
            for (let k in config) {
                let oldValue = keypath.get(current, k);
                let newValue = config[k];
                if (oldValue !== newValue) {
                    keypath.set(current, k, newValue);
                    this.trigger('config:changed', k, oldValue, newValue);
                }
            }
        }
        return current;
    }
};

/**
 * @class BaseFactory
 * @memberof Factory
 * @extends Observable
 * @implements ConfigurableMixin
 */
export class BaseFactory extends mix(Observable).with(ConfigurableMixin) { }

export const FactoryMixin = (SuperClass) => class extends SuperClass {
    static init(...args) {
        let obj = new this(...args);
        return obj.initialize(...args);
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
};

/**
 * @class Factory
 * @memberof Factory
 * @extends BaseFactory
 * @implements FactoryMixin
 * @implements InjectableMixin
 */
export class Factory extends mix(BaseFactory).with(FactoryMixin, InjectableMixin) { }
