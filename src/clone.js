import { isObject, isDate, isArray, isFunction } from './types.js';
import { get, reconstruct } from './proto.js';
import { getDescriptors, buildDescriptor } from './_helpers.js';

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
 * @param {boolean} [useStrict] Should preserve frozen and sealed objects.
 * @param {WeakMap} [cache] The cache for circular references.
 * @return {*} The clone of the object.
 */
export default function clone(obj, callback = noop, useStrict = false, cache = new WeakMap()) {
    if (typeof callback === 'boolean') {
        useStrict = callback;
        callback = noop;
    }
    if (isObject(obj) || isArray(obj)) {
        if (cache.has(obj)) {
            return cache.get(obj);
        }
        let res = reconstruct(get(obj));
        cache.set(obj, res);
        const descriptors = getDescriptors(obj);
        if (isArray(obj)) {
            // do not redefine `length` property.
            delete descriptors.length;
        }
        for (let key in descriptors) {
            const descriptor = descriptors[key];
            let value;
            if ('value' in descriptor) {
                value = callback(obj, key, clone(descriptor.value, callback, useStrict, cache));
            }
            Object.defineProperty(res, key, buildDescriptor(descriptor, value, useStrict ? descriptor.writable : true));
        }
        if (useStrict) {
            if (Object.isFrozen(obj)) {
                Object.freeze(res);
            } else if (Object.isSealed(obj)) {
                Object.seal(res);
            }
        }
        return res;
    } else if (isDate(obj)) {
        return new Date(obj.getTime());
    } else if (isFunction(obj)) {
        return obj;
    }
    return obj;
}
