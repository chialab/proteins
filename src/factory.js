/**
 * A set of classes with super powers.
 * For direct or extended use.
 *
 * @module Factory
 */

import mix from './mixin.js';
import Symbolic from './symbolic.js';
import * as keypath from './keypath.js';
import clone from './clone.js';
import merge from './merge.js';
import { isObject, isString } from './types.js';
import { on, off, trigger } from './events.js';
import { has } from './proto.js';

const FACTORY_SYM = new Symbolic('fsymbol');

/**
 * Symbol for Factory context.
 * @memberof Factory
 * @type {Symbolic}
 */
export const CONTEXT_SYM = new Symbolic('context');

/**
 * Symbol for Factory configuration.
 * @memberof Factory
 * @type {Symbolic}
 */
export const CONFIG_SYM = new Symbolic('config');

/**
 * Symbol for Factory listeners.
 * @memberof Factory
 * @type {Symbolic}
 */
export const LISTENERS_SYM = new Symbolic('listeners');

let context;

/**
 * Base Factory mixin.
 * @memberof Factory
 * @mixin FactoryMixin
 *
 * @param {Function} SuperClass The class to mix.
 * @return {Function} A base Factory constructor.
 */
export const FactoryMixin = (SuperClass) => class extends SuperClass {
    /**
     * A symbolic defintion for the Factory constructor.
     * @name BaseFactory.SYM
     * @type {Symbolic}
     * @memberof Factory.BaseFactory
     */
    static get SYM() {
        if (!this.hasOwnProperty(FACTORY_SYM.SYM)) {
            let sym = new Symbolic(this.name);
            sym.Ctr = this;
            this[FACTORY_SYM] = sym;
        }
        return this[FACTORY_SYM];
    }

    /**
     * @class BaseFactory
     * @memberof Factory
     *
     * @param {...*} [args] Arguments for the constructor.
     */
    constructor(...args) {
        super(...args);
        this[CONTEXT_SYM] = context || this;
    }

    /**
     * Init a new Factory with the same context.
     * @memberof Factory.BaseFactory
     *
     * @param {Function} Factory The Factory constructor.
     * @param {...*} args A list of arguments for the constructor.
     * @return {Object} The new instance.
     */
    init(Factory, ...args) {
        context = this[CONTEXT_SYM];
        let res = new Factory(...args);
        context = null;
        return res;
    }

    /**
     * Clear the context.
     * @memberof Factory.BaseFactory
     */
    destroy() {
        delete this[CONTEXT_SYM];
        return has(SuperClass, 'destroy') && super.destroy();
    }
};

/**
 * Events emitter mixin.
 * @memberof Factory
 * @mixin ObservableMixin
 *
 * @param {Function} SuperClass The class to mix.
 * @return {Function} A Observable constructor.
 */
export const ObservableMixin = (SuperClass) => class extends mix(SuperClass).with(FactoryMixin) {
    /**
     * @class Observable
     * @memberof Factory
     * @implements FactoryMixin
     *
     * @param {...*} [args] Arguments for the constructor.
     */
    constructor(...args) {
        super(...args);
        this[LISTENERS_SYM] = [];
    }

    /**
     * Add an event listener.
     * @memberof Factory.Observable
     *
     * @param {string} name The event name.
     * @param {Function} callback The callback to exec for the event.
     * @return {Function} A listener destroyer.
     */
    on(name, callback) {
        return on(this, name, callback);
    }

    /**
     * Remove an event(s) listener(s).
     * @memberof Factory.Observable
     *
     * @param {string} [name] The event name.
     * @param {Function} [callback] The optional callback to remove.
     */
    off(name, callback) {
        return off(this, name, callback);
    }

    /**
     * Dispatch an event.
     * @memberof Factory.Observable
     *
     * @param {string} name The event name.
     * @param {...*} args A list of arguments to pass to listeners.
     * @return {Promise} It resolves when all listeners have been triggered.
     */
    trigger(name, ...args) {
        return trigger(this, name, ...args);
    }

    /**
     * Listen events from another object.
     * @memberof Factory.Observable
     *
     * @param {Object} obj The object to listen.
     * @param {string} name The event name.
     * @param {Function} callback The callback to exec for the event.
     * @return {Function} A listener destroyer.
     */
    listen(obj, name, callback) {
        let destroyer = on(obj, name, callback);
        this[LISTENERS_SYM].push(destroyer);
        return destroyer;
    }

    /**
     * Unlisten event(s) from another object(s).
     * @memberof Factory.Observable
     *
     * @param {Object} [obj] The object to unlisten.
     * @param {string} [name] The event name.
     * @param {Function} [callback] The callback to exec for the event.
     * @return {Function} A listener destroyer.
     */
    unlisten(obj, name, callback) {
        if (obj) {
            off(obj, name, callback);
        } else {
            this[LISTENERS_SYM].forEach((offListener) => offListener());
            this[LISTENERS_SYM] = [];
        }
    }

    /**
     * Clear all listeners.
     * @memberof Factory.Observable
     */
    destroy() {
        this.off();
        this.unlisten();
        return super.destroy();
    }
};

/**
 * Configurable mixin.
 * @memberof Factory
 * @mixin ConfigurableMixin
 *
 * @param {Function} SuperClass The class to mix.
 * @return {Function} A Configurable constructor.
 */
export const ConfigurableMixin = (SuperClass) => class extends mix(SuperClass).with(FactoryMixin) {
    /**
     * @class Configurable
     * @memberof Factory
     * @implements FactoryMixin
     *
     * @property {Object} defaultConfig Default config object.
     *
     * @param {Object} [config] The instance configuration object.
     * @param {...*} [args] Other arguments for the super constructor.
     */
    constructor(config, ...args) {
        super(config, ...args);
        this[CONFIG_SYM] = clone(this.defaultConfig || {});
        if (config) {
            this.config(config);
        }
    }

    get defaultConfig() {
        return {};
    }

    /**
     * Update instance configuration.
     * @memberof Factory.Configurable
     *
     * @param {Object|string} config The configuration to update (or the path of the configuration property).
     * @param {*} [value] The value to update for the given config name.
     * @return {Object} Final configuration of the instance.
     */
    config(config, ...args) {
        let current = this[CONFIG_SYM];
        if (args.length === 0 && isString(config)) {
            return keypath.get(current, config);
        }
        let value = args[0];
        if (isString(config)) {
            let oldValue = keypath.get(current, config);
            if (oldValue !== value) {
                keypath.set(current, config, value);
                this.trigger('config:changed', config, oldValue, value);
            }
        }
        if (isObject(config)) {
            current = merge(current, config);
        }
        this[CONFIG_SYM] = current;
        return current;
    }

    /**
     * Clear the configuration.
     * @memberof Factory.Configurable
     */
    destroy() {
        delete this[CONFIG_SYM];
        return super.destroy();
    }
};

/**
 * Mixin for other multiple injections.
 * @memberof Factory
 * @mixin InjectableMixin
 *
 * @param {Function} SuperClass The class to mix.
 * @return {Function} A Factory constructor.
 */
export const InjectableMixin = (SuperClass) => class extends mix(SuperClass).with(FactoryMixin, ConfigurableMixin, ObservableMixin) {
    /**
     * @class Factory
     * @memberof Factory
     * @implements FactoryMixin
     * @implements ConfigurableMixin
     * @implements ObservableMixin
     *
     * @property {Array} inject A default list of injections.
     *
     * @param {...*} [args] Arguments for the constructor.
     */
    constructor(...args) {
        super(...args);
        let ctx = this[CONTEXT_SYM];
        this.inject.forEach((Injector) => {
            if (Injector instanceof Symbolic) {
                Injector = Injector.Ctr;
            }
            if (!this[Injector.SYM]) {
                if (ctx) {
                    this[Injector.SYM] = ctx[Injector.SYM] = ctx[Injector.SYM] || this.init(Injector);
                } else {
                    this[Injector.SYM] = this.init(Injector);
                }
            }
        });
    }

    get inject() {
        return [];
    }

    /**
     * Clear injected methods.
     * @memberof Factory.Factory
     */
    destroy() {
        let injectors = (this.config('inject') || []).concat(this.inject);
        injectors.forEach((Injector) => {
            let SYM = (Injector instanceof Symbolic) ? Injector : Injector.SYM;
            delete this[SYM];
        });
        return super.destroy();
    }
};

export class BaseFactory extends mix().with(FactoryMixin) { } 

export class Observable extends mix().with(ObservableMixin) { }

export class Configurable extends mix().with(ConfigurableMixin) { }

export class Factory extends mix().with(InjectableMixin) { }
