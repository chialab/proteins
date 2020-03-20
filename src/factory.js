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
import hasOwnProperty from './has.js';
import { isObject, isString } from './types.js';
import { on, off, trigger } from './events.js';
import { has } from './proto.js';

/**
 * Symbol for Factory instances.
 * @type {unique symbol}
 */
const FACTORY_SYM = Symbolic('fsymbol');

/**
 * Symbol for Factory context.
 * @type {unique symbol}
 */
export const CONTEXT_SYM = Symbolic('context');

/**
 * Symbol for Factory configuration.
 * @type {unique symbol}
 */
export const CONFIG_SYM = Symbolic('config');

/**
 * Symbol for Factory listeners.
 * @type {unique symbol}
 */
export const LISTENERS_SYM = Symbolic('listeners');

let context;

const FACTORY_SYMBOLS = {};

/**
 * Base Factory mixin.
 * @mixin FactoryMixin
 *
 * @param {Function} SuperClass The class to mix.
 * @return {Function} A base Factory constructor.
 */
export const FactoryMixin = (SuperClass) =>
    class BaseFactory extends SuperClass {
        /**
         * A symbolic defintion for the Factory constructor.
         * @type {unique symbol}
         */
        static get SYM() {
            if (!hasOwnProperty(this, FACTORY_SYM)) {
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
         */
        destroy() {
            delete this[CONTEXT_SYM];
            return has(SuperClass, 'destroy') && super.destroy();
        }
    };

/**
 * Events emitter mixin.
 * @mixin EmitterMixin
 *
 * @param {Function} SuperClass The class to mix.
 * @return {Function} A Emitter constructor.
 */
export const EmitterMixin = (SuperClass) =>
    class Emitter extends mix(SuperClass).with(FactoryMixin) {
        /**
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
         *
         * @param {string} [name] The event name.
         * @param {Function} [callback] The optional callback to remove.
         */
        off(name, callback) {
            return off(this, name, callback);
        }

        /**
         * Dispatch an event.
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
         */
        destroy() {
            this.off();
            this.unlisten();
            return super.destroy();
        }
    };

/**
 * Configurable mixin.
 * @mixin ConfigurableMixin
 *
 * @param {Function} SuperClass The class to mix.
 * @return {Function} A Configurable constructor.
 */
export const ConfigurableMixin = (SuperClass) =>
    class Configurable extends mix(SuperClass).with(FactoryMixin) {
        /**
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

        /**
         * Default config object.
         */
        get defaultConfig() {
            return {};
        }

        /**
         * Update instance configuration.
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
         */
        destroy() {
            delete this[CONFIG_SYM];
            return super.destroy();
        }
    };

/**
 * Mixin for other multiple injections.
 * @mixin InjectableMixin
 *
 * @param {Function} SuperClass The class to mix.
 * @return {Function} A Factory constructor.
 */
export const InjectableMixin = (SuperClass) =>
    class Factory extends mix(SuperClass).with(FactoryMixin) {
        /**
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

        /**
         * A default list of injections.
         */
        get inject() {
            return [];
        }

        /**
         * Clear injected methods.
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
