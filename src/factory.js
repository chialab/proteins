import mix from './mixin.js';
import internal from './internal.js';
import { isArray, isObject } from './types.js';
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

    getInjected() {
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
            let contextInjected = this.getContext().getInjected();
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
        let injected = this.getContext().getInjected();
        return injected && injected[name];
    }
};

export class Factory extends mix(BaseFactory)
    .with(ObservableMixin, FactoryMixin, InjectableMixin) { }
