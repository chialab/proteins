import { Emitter } from './factory.js';
import { isArray, isObject } from './types.js';
import Symbolic from './symbolic.js';

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
const SYM = new Symbolic('observable');

/**
 * Array prototype shortcut.
 * @type {Object}
 * @private
 */
const ARRAY_PROTO = Array.prototype;

/**
 * Emitter prototype shortcut.
 * @type {Object}
 * @private
 */
const EMITTER_PROTO = Emitter.prototype;

/**
 * Object.prototype.hasOwnProperty shortcut.
 * @type {Function}
 * @private
 */
const hasOwnProperty = Object.prototype.hasOwnProperty;

/**
 * Trigger object changes.
 * @param {Object|Array} scope The updated object.
 * @param {ChangeSet} changeset The changes descriptor.
 */
function triggerChanges(scope, changeset) {
    return EMITTER_PROTO.trigger.call(scope, 'change', changeset);
}

/**
 * Wrap Array prototype methods for changes triggering.
 * @type {Object}
 * @private
 */
const ARRAY_PROTO_WRAP = {
    push(...items) {
        let length = this.length;
        items = items.map((item, index) =>
            subobserve(this, length + index, item)
        );
        let res = ARRAY_PROTO.push.call(this, ...items);
        triggerChanges(this, {
            property: length,
            added: items,
            removed: [],
        });
        return res;
    },
    unshift(item) {
        let res = ARRAY_PROTO.push.unshift(this, item);
        subobserve(this, 0, item);
        triggerChanges(this, {
            property: 0,
            added: [item],
            removed: [],
        });
        return res;
    },
    pop() {
        let res = ARRAY_PROTO.pop.call(this);
        triggerChanges(this, {
            property: this.length,
            added: [],
            removed: [res],
        });
        return res;
    },
    shift() {
        let res = ARRAY_PROTO.shift.call(this);
        triggerChanges(this, {
            property: 0,
            added: [],
            removed: [res],
        });
        return res;
    },
    splice(index, count) {
        let res = ARRAY_PROTO.splice.call(this, index, count);
        triggerChanges(this, {
            property: index,
            added: [],
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
    if (isObject(value) || isArray(value) || value instanceof Observable) {
        value = new Observable(value);
        value.on('change', (changeset) => {
            name = isArray(target) ? target.indexOf(value) : name;
            let changes = {
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
    get: (target, name) => {
        if (isArray(target) && name in ARRAY_PROTO_WRAP) {
            return ARRAY_PROTO_WRAP[name].bind(target);
        }
        if (name in EMITTER_PROTO) {
            return EMITTER_PROTO[name].bind(target);
        }
        return target[name];
    },
    set: (target, name, value) => {
        if (name in Emitter.prototype) {
            return;
        }
        let oldValue = target[name];
        if (target[name] !== value) {
            value = subobserve(target, name, value);
            target[name] = value;

            triggerChanges(target, {
                property: name,
                oldValue,
                value,
            });
        }
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
        if (data instanceof Observable) {
            return data;
        }

        if (data[SYM]) {
            return data[SYM];
        }

        if (!isObject(data) && !isArray(data)) {
            throw new Error('Cannot observe this value.');
        }

        let proxy = new Proxy(data, handler);

        Object.keys(data).forEach((key) => {
            data[key] = subobserve(proxy, key, data[key]);
        });

        data[SYM] = proxy;

        return proxy;
    }
}
