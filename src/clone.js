import { isObject, isDate, isArray, isFunction } from './types.js';
import { get, reconstruct } from './proto.js';

/**
 * Useless callback function.
 * @private
 *
 * @param {*} scope The current object.
 * @param {string} key The current key.
 * @param {*} prop The current value.
 */
function noop(scope, key, prop) { return prop; }

/**
 * Clone an object.
 *
 * @method clone
 * @param {*} obj The instance to clone.
 * @param {Function} [callback] A modifier function for each property.
 * @param {WeakMap} [cache] The cache for circular references.
 * @return {*} The clone of the object.
 */
export default function clone(obj, callback = noop, cache = new WeakMap()) {
    if (isObject(obj) || isArray(obj)) {
        if (cache.has(obj)) {
            return cache.get(obj);
        }
        let res = reconstruct(get(obj));
        cache.set(obj, res);
        const descriptors = Object.getOwnPropertyDescriptors(obj);
        if (isArray(obj)) {
            // do not redefine `length` property.
            delete descriptors['length'];
        }
        for (let key in descriptors) {
            const desc = descriptors[key];
            let clonedVal = clone(obj[key], callback, cache);
            let val = callback(obj, key, clonedVal);
            let newDescriptor = {
                configurable: true,
                enumerable: desc.enumerable,
            };
            if (desc.get || desc.set) {
                newDescriptor['get'] = desc.get;
                newDescriptor['set'] = desc.set;
            } else {
                // `value` and `writable` are allowed in a descriptor only when there isn't a getter/setter.
                newDescriptor['value'] = val;
                newDescriptor['writable'] = desc.writable;
            }
            Object.defineProperty(res, key, newDescriptor);
        }
        return res;
    } else if (isDate(obj)) {
        return new Date(obj.getTime());
    } else if (isFunction(obj)) {
        return obj;
    }
    return obj;
}
