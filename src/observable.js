import { Emitter } from './factory.js';
import { extend, get, reconstruct, set } from './proto.js';
import Symbolic from './symbolic.js';
import { isArray, isObject } from './types.js';

/**
 * @typedef ChangeSet
 * @property {String} property The path to the changed property.
 * @property {*} oldValue The old value for the property.
 * @property {*} newValue The new value for the property.
 * @property {Array} added A list of added items to an array.
 * @property {Array} remove A list of remove items from an array.
 */
/**
 * Observable Symbol.
 * @type {Symbolic}
 * @private
 */
const OBSERVABLE_SYM = Symbolic('observable');
/**
 * Array prototype shortcut.
 * @type {Object}
 * @private
 */
const ARRAY_PROTO = Array.prototype;
/**
 * Object.prototype.hasOwnProperty shortcut.
 * @type {Function}
 * @private
 */
const hasOwnProperty = Object.prototype.hasOwnProperty;
/**
 * Micro Proxy polyfill.
 * @private
 */
const ProxyHelper =
    typeof Proxy !== 'undefined'
        ? Proxy
        : class {
              constructor(data, handler) {
                  const res = reconstruct(get(data));
                  Object.keys(data)
                      .filter((key) => Object.getOwnPropertyDescriptor(data, key).configurable)
                      .forEach((key) => {
                          this.define(res, data, key, handler);
                      });
                  if (isArray(data)) {
                      let lastLength = data.length;
                      res.on('change', () => {
                          if (data.length !== lastLength) {
                              Object.keys(data).forEach((key) => {
                                  if (key !== OBSERVABLE_SYM) {
                                      this.define(res, data, key, handler);
                                  }
                              });
                              lastLength = data.length;
                          }
                      });
                  }
                  res[OBSERVABLE_SYM] = data[OBSERVABLE_SYM];
                  return res;
              }
              define(res, data, property, handler) {
                  const desc = {
                      configurable: true,
                      enumerable: 'enumerable' in handler ? handler.enumerable : !Symbolic.isSymbolic(property),
                  };
                  if (handler.get) {
                      desc.get = () => handler.get(data, property);
                  }
                  if (handler.set) {
                      desc.set = (val) => handler.set(data, property, val);
                  }
                  Object.defineProperty(res, property, desc);
              }
          };
/**
 * Trigger object changes.
 * @private
 *
 * @param {Object|Array} scope The updated object.
 * @param {ChangeSet} changeset The changes descriptor.
 */
function triggerChanges(scope, changeset) {
    return scope[OBSERVABLE_SYM].trigger('change', changeset);
}
/**
 * Wrap Array prototype methods for changes triggering.
 * @type {Object}
 * @private
 */
const ARRAY_PROTO_WRAP = {
    push(...items) {
        const length = this.length;
        items = items.map((item, index) => subobserve(this, length + index, item));
        const res = ARRAY_PROTO.push.call(this, ...items);
        triggerChanges(this, {
            property: length,
            added: items,
            removed: [],
        });
        return res;
    },
    unshift(item) {
        const res = ARRAY_PROTO.unshift.call(this, item);
        subobserve(this, 0, item);
        triggerChanges(this, {
            property: 0,
            added: [item],
            removed: [],
        });
        return res;
    },
    pop() {
        const res = ARRAY_PROTO.pop.call(this);
        triggerChanges(this, {
            property: this.length,
            added: [],
            removed: [res],
        });
        return res;
    },
    shift() {
        const res = ARRAY_PROTO.shift.call(this);
        triggerChanges(this, {
            property: 0,
            added: [],
            removed: [res],
        });
        return res;
    },
    splice(index, count, ...items) {
        items = items.map((item, index) => subobserve(this, this.length + index, item));
        const res = ARRAY_PROTO.splice.call(this, index, count, ...items);
        triggerChanges(this, {
            property: index,
            added: items,
            removed: [res],
        });
        return res;
    },
};
/**
 * Subobserve objects.
 * @private
 *
 * @param {Object|Array} target The root object.
 * @param {String} name The root object property name
 * @param {Object|Array} value The sub object to observe.
 * @return {Observable} The Observable instance for the sub object.
 */
function subobserve(target, name, value) {
    if (isObject(value) || isArray(value)) {
        value = new Observable(value);
        value.on('change', (changeset) => {
            name = isArray(target) ? target.indexOf(value) : name;
            const changes = {
                property: `${name}.${changeset.property}`,
            };
            if (hasOwnProperty.call(changeset, 'value')) {
                changes.oldValue = changeset.oldValue;
                changes.value = changeset.value;
            } else if (hasOwnProperty.call(changeset, 'added')) {
                changes.added = changeset.added;
                changes.removed = changeset.removed;
            }
            triggerChanges(target, changes);
        });
    }
    return value;
}
/**
 * ES6 Proxy handler.
 * @type {Object}
 * @private
 */
const handler = {
    getPrototypeOf(target) {
        if (isArray(target)) {
            return target.constructor.prototype;
        }
        return Reflect.getPrototypeOf(target);
    },
    get: (target, name) => target[name],
    set: (target, name, value) => {
        if (Symbolic.isSymbolic(name)) {
            return (target[name] = value);
        }
        const oldValue = target[name];
        if (target[name] !== value) {
            value = subobserve(target, name, value);
            target[name] = value;
            triggerChanges(target, {
                property: name,
                oldValue,
                value,
            });
        }
        return true;
    },
};
/**
 * Create an Observable object for a set of data or an array.
 *
 * @param {Object|Array} data The object to observe.
 * @return {Proxy} The observed object proxy.
 */
export default class Observable {
    constructor(data) {
        if (typeof data !== 'object') {
            throw new Error('Cannot observe this value.');
        }
        const emitter = data[OBSERVABLE_SYM] || new Emitter();

        if (emitter.proxy) {
            return emitter.proxy;
        }
        const proto = {
            on: { value: emitter.on.bind(emitter) },
            off: { value: emitter.off.bind(emitter) },
            trigger: { value: emitter.trigger.bind(emitter) },
        };
        if (isArray(data)) {
            proto.push = { get: () => ARRAY_PROTO_WRAP.push.bind(data) };
            proto.unshift = { get: () => ARRAY_PROTO_WRAP.unshift.bind(data) };
            proto.pop = { get: () => ARRAY_PROTO_WRAP.pop.bind(data) };
            proto.shift = { get: () => ARRAY_PROTO_WRAP.shift.bind(data) };
            proto.splice = { get: () => ARRAY_PROTO_WRAP.splice.bind(data) };
        }
        data[OBSERVABLE_SYM] = emitter;
        set(data, extend(get(data), proto));
        emitter.proxy = new ProxyHelper(data, handler);
        Object.keys(data).forEach((key) => {
            if (key !== OBSERVABLE_SYM) {
                data[key] = subobserve(data, key, data[key]);
            }
        });
        return emitter.proxy;
    }
    /**
     * Re-observe an array or an object after adding a property.
     *
     * You should invoke this static method only after adding a new property
     * to an object, and only if you wish to support browsers that do not have
     * native Proxy object. This is required because it is impossible to
     * intercept new properties added to an existing object from the polyfill.
     *
     * ## Example
     *
     * ```js
     * const myObservable = new Observable({ foo: 'foo' });
     *
     * // This is not enough to trigger changes in older browsers!
     * myObservable.bar = 'bar';
     *
     * // So, you should invoke this immediately after:
     * Observable.reobserve(myObservable);
     * ```
     *
     * @param {Object|Array} data Data to be re-observed.
     * @return {void}
     */
    static reobserve(data) {
        if (typeof Proxy !== 'undefined') {
            // Native proxy support. We're good.
            return;
        }
        // Ensure `data` is an observable.
        new Observable(data);
        Object.keys(data).forEach((key) => {
            const descriptor = Object.getOwnPropertyDescriptor(data, key);
            if (key !== OBSERVABLE_SYM && descriptor && descriptor.configurable && 'value' in descriptor) {
                // Key has been added and is not yet observed. Big Brother is on its way.
                data[key] = subobserve(data, key, data[key]);
                triggerChanges(data, {
                    property: key,
                    oldValue: undefined,
                    value: data[key],
                });
            }
        });
    }
}
