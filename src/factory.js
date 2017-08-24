import mix from './mixin.js';
import Symbolic from './symbolic.js';
import * as keypath from './keypath.js';
import clone from './clone.js';
import merge from './merge.js';
import { isObject, isString } from './types.js';
import { on, off, trigger } from './events.js';
import { init, getContext, setContext } from './context.js';

/**
 * A set of classes with super powers.
 * For direct or extended use.
 *
 * @module Factory
 */

const FACTORY_SYM = new Symbolic('fsymbol');

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

export const FactoryMixin = (SuperClass) => class extends SuperClass {
    static get SYM() {
        if (!this.hasOwnProperty(FACTORY_SYM.SYM)) {
            let sym = new Symbolic(this.name);
            sym.Ctr = this;
            this[FACTORY_SYM] = sym;
        }
        return this[FACTORY_SYM];
    }

    constructor(...args) {
        super(...args);
        setContext(this);
    }

    init(...args) {
        return init(this, ...args);
    }

    destroy() {
        setContext(this, null);
        return SuperClass.prototype.destroy && super.destroy();
    }
};

/**
 * Events emitter mixin.
 * @memberof Factory
 * @mixin ObservableMixin
 */
export const ObservableMixin = (SuperClass) => class extends mix(SuperClass).with(FactoryMixin) {
    constructor(...args) {
        super(...args);
        this[LISTENERS_SYM] = [];
    }

    /**
     * Add an event listener.
     * @memberof Factory.ObservableMixin
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
     * @memberof Factory.ObservableMixin
     *
     * @param {string} name? The event name.
     * @param {Function} callback? The optional callback to remove.
     */
    off(name, callback) {
        return off(this, name, callback);
    }

    /**
     * Dispatch an event.
     * @memberof Factory.ObservableMixin
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
     * @memberof Factory.ObservableMixin
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
     * @memberof Factory.ObservableMixin
     *
     * @param {Object} obj? The object to unlisten.
     * @param {string} name? The event name.
     * @param {Function} callback? The callback to exec for the event.
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
     * @memberof Factory.ObservableMixin
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
 * @param {Object} config? The instance configuration object.
 */
export const ConfigurableMixin = (SuperClass) => class extends mix(SuperClass).with(FactoryMixin) {
    /**
     * Default config object.
     * @type {Object}
     * @memberof Factory.ConfigurableMixin
     */
    get defaultConfig() {
        return {};
    }

    constructor(config) {
        super(config);
        this[CONFIG_SYM] = clone(this.defaultConfig || {});
        if (config) {
            this.config(config);
        }
    }

    /**
     * Update instance configuration.
     * @memberof Factory.ConfigurableMixin
     *
     * @param {Object|string} config The configuration to update (or the path of the configuration property).
     * @param {*} value? The value to update for the given config name.
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
     * @memberof Factory.ConfigurableMixin
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
 */
export const InjectableMixin = (SuperClass) => class extends mix(SuperClass).with(ConfigurableMixin) {
    get inject() {
        return [];
    }

    constructor(...args) {
        super(...args);
        let injectors = (this.config('inject') || []).concat(this.inject);
        let ctx = getContext(this);
        injectors.forEach((Injector) => {
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

    destroy() {
        let injectors = (this.config('inject') || []).concat(this.inject);
        injectors.forEach((Injector) => {
            let SYM = (Injector instanceof Symbolic) ? Injector : Injector.SYM;
            delete this[SYM];
        });
        return super.destroy();
    }
};

/**
 * @class Observable
 * @memberof Factory
 * @implements ObservableMixin
 */
export class Observable extends mix().with(ObservableMixin) { }

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
export class Factory extends mix(Configurable).with(InjectableMixin) { }
