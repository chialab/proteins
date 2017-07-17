import { isObject, isDate, isArray } from './types.js';

function noop(scope, key, prop) { return prop; }

/**
 * Clone an object.
 *
 * @method clone
 * @param {*} obj The instance to clone.
 * @param {Function} [callback] A modifier function for each property.
 * @return {*} The clone of the object.
 */
export default function clone(obj, callback = noop) {
    if (isArray(obj)) {
        return obj.map((entry, index) => {
            entry = callback(obj, index, entry);
            return clone(entry, callback);
        });
    } else if (isObject(obj)) {
        let res = {};
        Object.keys(obj).forEach((k) => {
            let val = callback(obj, k, obj[k]);
            res[k] = clone(val, callback);
        });
        return res;
    } else if (isDate(obj)) {
        return new Date(obj.getTime());
    }
    return obj;
}
