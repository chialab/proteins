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

const FACTORY_SYM = Symbolic('fsymbol');

/**
 * Symbol for Factory context.
 * @memberof Factory
 * @type {Symbolic}
 */
export const CONTEXT_SYM = Symbolic('context');

/**
 * Symbol for Factory configuration.
 * @memberof Factory
 * @type {Symbolic}
 */
export const CONFIG_SYM = Symbolic('config');

/**
 * Symbol for Factory listeners.
 * @memberof Factory
 * @type {Symbolic}
 */
export const LISTENERS_SYM = Symbolic('listeners');

let context;

const FACTORY_SYMBOLS = {};

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
        if (!this.hasOwnProperty(FACTORY_SYM)) {
            let sym = Symbolic(this.name);
            FACTORY_SYMBOLS[sym] = this;
            this[FACTORY_SYM] = sym;
        }
        return this[FACTORY_SYM];
    }

    constructor(...args) {
        super(...args);
        this.initialize(...args);
    }

    /**
     * @class BaseFactory
     * @memberof Factory
     *
     * @param {...*} [args] Arguments for super initialize.
     */
    initialize(...args) {
        if (!this[CONTEXT_SYM]) {
            this[CONTEXT_SYM] = context || this;
        }
        return has(SuperClass, 'initialize') && super.initialize(...args);
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
 * @mixin EmitterMixin
 *
 * @param {Function} SuperClass The class to mix.
 * @return {Function} A Emitter constructor.
 */
export const EmitterMixin = (SuperClass) => class extends mix(SuperClass).with(FactoryMixin) {
    /**
     * @class Emitter
     * @memberof Factory
     * @implements FactoryMixin
     *
     * @param {...*} [args] Arguments for the constructor.
     */
    initialize(...args) {
        super.initialize(...args);
        if (!this[LISTENERS_SYM]) {
            this[LISTENERS_SYM] = [];
        }
    }

    /**
     * Add an event listener.
     * @memberof Factory.Emitter
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
     * @memberof Factory.Emitter
     *
     * @param {string} [name] The event name.
     * @param {Function} [callback] The optional callback to remove.
     */
    off(name, callback) {
        return off(this, name, callback);
    }

    /**
     * Dispatch an event.
     * @memberof Factory.Emitter
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
     * @memberof Factory.Emitter
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
     * @memberof Factory.Emitter
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
     * @memberof Factory.Emitter
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
    initialize(config, ...args) {
        super.initialize(config, ...args);
        if (!this[CONFIG_SYM]) {
            this[CONFIG_SYM] = clone(this.defaultConfig || {});
            if (config) {
                this.config(config);
            }
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
export const InjectableMixin = (SuperClass) => class extends mix(SuperClass).with(FactoryMixin) {
    /**
     * @class Factory
     * @memberof Factory
     * @implements FactoryMixin
     * @implements ConfigurableMixin
     * @implements EmitterMixin
     *
     * @property {Array} inject A default list of injections.
     *
     * @param {...*} [args] Arguments for the constructor.
     */
    initialize(...args) {
        super.initialize(...args);
        let ctx = this[CONTEXT_SYM];
        this.inject.forEach((Injector) => {
            if (Symbolic.isSymbolic(Injector)) {
                Injector = FACTORY_SYMBOLS[Injector];
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
        this.inject.forEach((Injector) => {
            let SYM = (Symbolic.isSymbolic(Injector)) ? Injector : Injector.SYM;
            delete this[SYM];
        });
        return super.destroy();
    }
};

export class BaseFactory extends mix().with(FactoryMixin) { } 

export class Emitter extends mix().with(EmitterMixin) { }

export class Configurable extends mix().with(ConfigurableMixin) { }

export class Factory extends mix().with(EmitterMixin, ConfigurableMixin, InjectableMixin) { }
