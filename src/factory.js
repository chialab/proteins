import mix from './mixin.js';
import internal from './internal.js';
import keypath from './keypath.js';
import clone from './clone.js';
import { isArray, isObject, isString } from './types.js';
import { ObservableMixin } from './observable.js';

export class BaseFactory {}

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

export const ConfigurableMixin = (SuperClass) => class extends SuperClass {
    get defaultConfig() {
        return {};
    }

    initialize(config, ...args) {
        this.internal().config = clone(this.defaultConfig);
        return super.initialize(config, ...args)
            .then(() => {
                this.config(config);
                return Promise.resolve(this);
            });
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

export class Factory extends mix(BaseFactory)
    .with(ObservableMixin, FactoryMixin, InjectableMixin, ConfigurableMixin) { }
