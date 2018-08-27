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
 * @param {Array} [cache] The cache array for circular references.
 * @return {*} The clone of the object.
 */
export default function clone(obj, callback = noop, cache = []) {
    if (isArray(obj)) {
        return obj.map((entry, index) => {
            entry = callback(obj, index, entry);
            return clone(entry, callback, cache);
        });
    } else if (isObject(obj)) {
        let cached = cache.indexOf(obj);
        if (cached !== -1) {
            return cache[cached + 1];
        }
        let res = reconstruct(get(obj));
        cache.push(obj, res);
        Object.keys(obj).forEach((k) => {
            let val = callback(obj, k, obj[k]);
            res[k] = clone(val, callback, cache);
        });
        return res;
    } else if (isDate(obj)) {
        return new Date(obj.getTime());
    } else if (isFunction(obj)) {
        return obj;
    }
    return obj;
}
