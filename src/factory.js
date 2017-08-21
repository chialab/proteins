import mix from './mixin.js';
import Symbolic from './symbolic.js';
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
 * Symbol for Factory private fields.
 * @memberof Factory
 * @type Function
 */
export const PRIVATE_SYM = new Symbolic('private');

/**
 * Symbol for Factory configuration.
 * @memberof Factory
 * @type Function
 */
export const CONFIG_SYM = new Symbolic('config');

/**
 * Symbol for Factory context.
 * @memberof Factory
 * @type Function
 */
export const CONTEXT_SYM = new Symbolic('context');

/**
 * Symbol for Factory injections.
 * @memberof Factory
 * @type Function
 */
export const INJECTIONS_SYM = new Symbolic('injections');

/**
 * Factory base mixin.
 * @mixin BaseMixin
 * @memberof Factory
 */
export const BaseMixin = (SuperClass) => class extends SuperClass {
    constructor(...args) {
        super(...args);
        PRIVATE_SYM.set(this, {});
    }

    internal() {
        return PRIVATE_SYM.get(this);
    }

    destroy() {
        PRIVATE_SYM.destroy(this);
        return Promise.resolve();
    }

    isDestroyed() {
        return !PRIVATE_SYM.has(this);
    }
};

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

export const ConfigurableMixin = (SuperClass) => class extends SuperClass {
    get defaultConfig() {
        return {};
    }

    constructor(config) {
        super(config);
        CONFIG_SYM.set(this, clone(this.defaultConfig || {}));
        if (config) {
            this.config(config);
        }
    }

    config(config, ...args) {
        let current = CONFIG_SYM.get(this);
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

    destroy() {
        CONFIG_SYM.destroy(this);
        return super.destroy();
    }
};

export const ContextualMixin = (SuperClass) => class extends SuperClass {
    static init(...args) {
        let obj = new this(...args);
        return obj.initialize(...args);
    }

    constructor(...args) {
        super(...args);
        CONTEXT_SYM.set(this, this);
    }

    initialize() {
        this.internal().initialized = true;
        return Promise.resolve(this);
    }

    init(Class, ...args) {
        let obj = new Class(...args);
        CONTEXT_SYM.set(obj, CONTEXT_SYM.get(this));
        if (obj.internal().initialized) {
            return Promise.resolve(obj);
        }
        return obj.initialize(...args);
    }

    destroy() {
        CONTEXT_SYM.destroy(this);
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
        return super.initialize(...args)
            .then(() => {
                let context = CONTEXT_SYM.get(this);
                if (!INJECTIONS_SYM.has(context)) {
                    INJECTIONS_SYM.set(context, {});
                }
                let injectors = this.config('injectors') || this.constructor.injectors;
                return this.inject(injectors);
            }).then(() =>
                Promise.resolve(this)
            );
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
            let context = CONTEXT_SYM.get(this);
            let contextInjected = INJECTIONS_SYM.get(context);
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
                    return this.trigger('inject:ready', inject, fn);
                });
        }
        return promise;
    }

    factory(name) {
        let context = CONTEXT_SYM.get(this);
        let contextInjected = INJECTIONS_SYM.get(context);
        return contextInjected && contextInjected[name];
    }

    destroy() {
        INJECTIONS_SYM.destroy(this);
        return super.destroy();
    }
};

/**
 * @class Base
 * @memberof Factory
 * @implements BaseMixin
 */
export class Base extends mix().with(BaseMixin) { }

/**
 * @class Observable
 * @memberof Factory
 * @extends Base
 * @implements ObservableMixin
 */
export class Observable extends mix(Base).with(ObservableMixin) { }

/**
 * @class Configurable
 * @memberof Factory
 * @extends Observable
 * @implements ConfigurableMixin
 */
export class Configurable extends mix(Observable).with(ConfigurableMixin) { }

/**
 * @class Factory
 * @memberof Factory
 * @extends Configurable
 * @implements ContextualMixin
 * @implements InjectableMixin
 */
export class Factory extends mix(Configurable).with(ContextualMixin, InjectableMixin) { }
